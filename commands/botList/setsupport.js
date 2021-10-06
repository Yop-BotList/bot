const { Client, Message, MessageEmbed } = require('discord.js'),
      { botslogs } = require('../../configs/channels.json'),
      { verificator } = require('../../configs/roles.json'),
      { prefix } = require("../../configs/config.json"),
      bots = require("../../models/bots");

module.exports = {
    name: 'setsupport',
    aliases: ['botsupport'],
    categories : 'botlist', 
    permissions : "everyone", 
    description: 'Modifier le lien du serveur support d\'un bot.',
    cooldown : 5,
    usage: 'setsupport <id bot> <lien | none>',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if (!args[0]) return message.channel.send(`\`\`\`${prefix}setsupport <id bot> <invitation | none>\`\`\``)
            const member = message.guild.members.cache.get(`${args[0]}`)
            if (!member) return message.channel.send(`**${client.no} ➜ Identifiant invalide.**`)
            const db = await bots.findOne({ botID: member.user.id })
            if (!db) return message.channel.send("**" + client.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**')
            if (db.ownerID !== message.author.id && !message.member.roles.cache.get(verificator)) return message.channel.send("**" + client.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**")
            if (!args[1]) return message.channel.send("**" + client.no + ' ➜ Il faudrai peut-être entrer un lien non ?**')
            if (args[1] === 'none' && db.serverInvite) {
                const e = new MessageEmbed()
                .setColor(client.color)
                .setTitle("Modification du profil...")
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp(new Date())
                .setDescription(`<@${message.author.id}> vient juste d'éditer le lien du serveur support de votre robot <@${member.id}> :`)
                .setFields({
                    name: "➜ Avant :",
                    value: `\`\`\`none\`\`\``,
                    inline: false
                },
                {
                    name: "➜ Après :",
                    value: `\`\`\`${args[1]}\`\`\``,
                    inline: false
                })
                client.channels.cache.get(botslogs).send({ content: `<@${db.ownerID}>`, embeds: [e] })
                message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
                setTimeout(async () => {
                    return await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { serverInvite: null } }, { upsert: true })
                }, 2000)
            }
            if (args[1] === 'none' && !db.serverInvite) return message.channel.send("**" + client.no + ' ➜ Tu m\'as demandé supprimer un lien qui n\'a jamais été enregistré ¯\\_(ツ)_/¯**')
            if (args[1] !== "none") {
                if (!args[1].startsWith('https://discord.gg/') || args[1] === "https://discord.gg/") return message.channel.send("**" + client.no + " ➜ Le lien entré est invalide. Je vous rappelle que le lien doit commencer par `https://discord.gg/`**")
                if (!db.serverInvite) var before = "none"
                if (db.serverInvite) var before = db.serverInvite

                const e = new MessageEmbed()
                .setColor(client.color)
                .setTitle("Modification du profil...")
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp(new Date())
                .setDescription(`<@${message.author.id}> vient juste d'éditer le lien du serveur support de votre robot <@${member.id}> :`)
                .setFields({
                    name: "➜ Avant :",
                    value: `\`\`\`${before}\`\`\``,
                    inline: false
                },
                {
                    name: "➜ Après :",
                    value: `\`\`\`${args[1]}\`\`\``,
                    inline: false
                })
                client.channels.cache.get(botslogs).send({ content: `<@${db.ownerID}>`, embeds: [e] })
                message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
                setTimeout(async () => {
                    return await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { serverInvite: args[1] } }, { upsert: true })
                }, 2000)
            }
    }
}