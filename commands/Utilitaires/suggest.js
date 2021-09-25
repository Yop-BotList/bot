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
        if (!args[0]) return message.channel.send(`\`\`\`${prefix}suggest <suggestion | accept | reject | delete | list>\`\`\``)
        if (args[0] !== "accept" && "reject" && "delete" && "list") {
            const db = await bot.findOne()
            if (!db) new bot({ suggests: 0 })
    
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
                    content: message.content.slice(10)
                }).save()
                if (db) await bot.findOneAndUpdate({ suggests: db.suggests + 1 })
                
    
                return message.channel.send(`**${client.yes} ➜ Votre suggestion a bien été envoyée. Allez voir dans le <#${channels.suggests}>.**`)
            });
        }
        if (args[0] === "accept") {
            if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
            if (!args[1]) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion.**`)
            const db = await bot.findOne({ suggestID: parseInt(args[1]), accepted: false, deleted: false });
            if (!db) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`)
            const msg = await message.guild.channels.cache.get(channels.suggests).messages.fetch(db.messageID);
            msg.edit({ content: "yo" })
        }
    }
}
