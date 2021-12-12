'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require('discord.js'),
      bots = require("../../models/bots"),
      { prefix } = require("../../configs/config.json"),
      { botslogs } = require('../../configs/channels.json'),
      { verificator } = require("../../configs/roles.json");

class Setdesc extends Command {
    constructor() {
        super({
            name: 'setdesc',
            category: 'botlist',
            description: 'Définir la description d\'un bot.',
            aliases: ["botdesc"],
            usage: 'setdesc <id> <description | none>',
            example: ["setdesc 692374264476860507 Bot de musique", "botdesc 692374264476860507 none"],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        if (!args[0]) return message.channel.send(`\`\`\`${prefix}setdesc <id bot> <description | none>\`\`\``)
       const member = await message.guild.members.fetch(args[0])
        if (!member) return message.channel.send(`**${client.no} ➜ Veuillez entrer l'indentifiant valide d'un bot présent sur ce serveur.**`)
        const db = await bots.findOne({ botID: member.user.id });
        if (!db) return message.channel.send("**" + client.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**')
        if (db.ownerID !== message.author.id && !message.member.roles.cache.get(verificator)) return message.channel.send("**" + client.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**")
        if (!args[1]) return message.channel.send("**" + client.no + ' ➜ Il faudrai peut-être entrer une description non ?**')
        if (args[1] === 'none' && db.desc) {
            const e = new MessageEmbed()
            .setColor(client.color)
            .setTitle("Modification du profil...")
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp(new Date())
            .setDescription(`<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`)
            .setFields({
                name: "➜ Avant :",
                value: `\`\`\`${db.desc}\`\`\``,
                inline: false
            },
            {
                name: "➜ Après :",
                value: `\`\`\`none\`\`\``,
                inline: false
            })
            client.channels.cache.get(botslogs).send({ content: `<@${db.ownerID}>`, embeds: [e] })
            message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
            setTimeout(async () => {
                return await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { desc: null } }, { upsert: true })
            }, 2000)
        }
        if (args[1] === 'none' && !db.desc) return message.channel.send("**" + client.no + ' ➜ Tu m\'as demandé supprimer une description qui n\'a jamais été enregistrée ¯\\_(ツ)_/¯**')
        if (args[1] !== "none") {
            if (message.content.length > 300) return message.channel.send("**" + client.no + " ➜ Votre description ne doit pas dépasser les 300 caractères.**")
            const e = new MessageEmbed()
            .setColor(client.color)
            .setTitle("Modification du profil...")
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp(new Date())
            .setDescription(`<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`)
            .setFields({
                name: "➜ Avant :",
                value: `\`\`\`none\`\`\``,
                inline: false
            },
            {
                name: "➜ Après :",
                value: `\`\`\`${args.slice(1).join(" ")}\`\`\``,
                inline: false
            })
            client.channels.cache.get(botslogs).send({ content: `<@${db.ownerID}>`, embeds: [e] })
            message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
            setTimeout(async () => {
                return await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { desc: args.slice(1).join(" ") } }, { upsert: true })
            }, 2000)
        }
    }
}

module.exports = new Setdesc;
