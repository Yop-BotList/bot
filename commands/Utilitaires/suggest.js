const { Client, Message, MessageEmbed } = require("discord.js"),
      { bof } = require("../../configs/emojis.json"),
      channels = require("../../configs/channels.json"),
      { prefix } = require("../../configs/config.json"),
      suggests = require("../../models/suggests"),
      packages = require("../../package.json"),
      bot = require("../../models/botconfig");

      
module.exports = {
    name: "suggest",
    description: "Permet d'envoyer, d'accepter, de supprimer ou de rejeter une suggestion.",
    categories: "info",
    permissions: "everyone",
    cooldown: 15,
    usage: "suggest <suggestion | accept | reject | delete |  list>",
    /**
     *  @param {Client} client
     *  @param {Message} message
     *  @param {String[]} args
     */

    run: async(client, message, args) => {

        // create
        if (!args[0]) return message.channel.send(`\`\`\`${prefix}suggest <suggestion | accept | reject | delete | list>\`\`\``)
        if (args[0] !== "accept" && args[0] !== "reject" && args[0] !== "delete") {
            const db1 = await bot.findOne()
            if (!db1) new bot({ suggests: 0 }).save()
            const db = await bot.findOne()
    
            const e = new MessageEmbed()
            .setTitle(`Nouvelle suggestion de ${message.author.username} ! (N°${db.suggests + 1})`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .setDescription(`\`\`\`md\n# ${args.join(' ')}\n\`\`\`\n**Réagissez :**\n${client.yes} = Oui\n${bof} = Pourquoi pas ?\n${client.no} = Non`)
            client.channels.cache.get(channels.suggests).send({ embeds: [e] }).then(async(msg) => {
                msg.react('838334340618256384')
                msg.react('838334339820945419')
                msg.react('838334340160815104')
    
                // database
                new suggests({
                    userID: message.author.id,
                    msgID: msg.id,
                    suggID: db.suggests + 1,
                    accepted: false,
                    deleted: false,
                    content: args.join(" ")
                }).save()
                if (db) await bot.findOneAndUpdate({ suggests: db.suggests + 1 })
                
    
                return message.channel.send(`**${client.yes} ➜ Votre suggestion a bien été envoyée. Allez voir dans le <#${channels.suggests}>.**`)
            });
        }

        // accept
        if (args[0] === "accept") {
            if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
            if (!args[1]) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion.**`)
            const db = await suggests.findOne({ suggestID: args[1], accepted: false, deleted: false });
            if (!db) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`)
            const member = message.guild.members.cache.get(db.userID),
                  reason = args.slice(2).join(" ") || `Aucun commentaire...`

            message.guild.channels.cache.get(channels.suggests).messages.fetch(db.msgID).then(async (msg) => {
                const e1 = new MessageEmbed()
                .setTitle(`Suggestion de ${member.user.username} acceptée par ${message.author.username} !`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor(client.color)
                .setTimestamp(new Date())
                .setDescription(`\`\`\`md\n# ${db.content}\n\`\`\``)
                .addField(`Commentaire de ${message.author.username} :`, `\`\`\`diff\n+ ${reason}\n\`\`\``)

                msg.edit({ embeds: [e1] });

                await suggests.findOneAndUpdate({ suggID: db.suggID }, { $set: { accepted: true } }, { upsert: true });

                const e2 = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<@${message.author.id}> vient tout juste d'accepter votre [suggestion](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) ! Merci à toi !`)

                message.guild.channels.cache.get(channels.sugglogs).send({ content: `<@${db.userID}>`, embeds: [e2] })

                message.channel.send(`**${client.yes} ➜ La suggestion a bien été acceptée !**`)
            })
        }

        // reject
        if (args[0] === "reject") {
            if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
            if (!args[1]) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion.**`)
            const db = await suggests.findOne({ suggestID: args[1], accepted: false, deleted: false });
            if (!db) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`)
            const member = message.guild.members.cache.get(db.userID),
                  reason = args.slice(2).join(" ")

            if (!reason) return message.channel.send(`**${client.no} ➜ Veuillez entrer une raison.**`)

            message.guild.channels.cache.get(channels.suggests).messages.fetch(db.msgID).then(async (msg) => {
                const e1 = new MessageEmbed()
                .setTitle(`Suggestion de ${member.user.username} refusée par ${message.author.username} !`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor(client.color)
                .setTimestamp(new Date())
                .setDescription(`\`\`\`md\n# ${db.content}\n\`\`\``)
                .addField(`Commentaire de ${message.author.username} :`, `\`\`\`diff\n- ${reason}\n\`\`\``)

                msg.edit({ embeds: [e1] });

                await suggests.findOneAndUpdate({ suggID: db.suggID }, { $set: { accepted: true } }, { upsert: true });

                const e2 = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<@${message.author.id}> vient tout juste de refuser votre [suggestion](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) ! Merci quand même d'avoir proposé quelque chose !`)

                message.guild.channels.cache.get(channels.sugglogs).send({ content: `<@${db.userID}>`, embeds: [e2] })

                message.channel.send(`**${client.yes} ➜ La suggestion a bien été refusée !**`)
            })
        }
    }
}
