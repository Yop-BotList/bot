'use strict';

const Command = require("../../structure/Command.js"),
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
        const member = message.guild.members.fetch(`${args[0]}`);
        if (!member) return message.channel.send(`**${client.no} ➜ Veuillez entrer l'indentifiant valide d'un bot présent sur ce serveur.**`)
        const db = await bots.findOne({ botID: member.user.id });
        if (!db) return message.channel.send("**" + client.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**')
        if (db.ownerID !== message.author.id && !message.member.roles.cache.get(verificator)) return message.channel.send("**" + client.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**")
        if (!args[1]) return message.channel.send("**" + client.no + ' ➜ Il faudrai peut-être entrer une description non ?**')
        if (args[1] === 'none' && db.desc) {
            client.channels.cache.get(botslogs).send({
                content: `<@${db.ownerID}>`,
                embeds: [{
                    color: client.color,
                    title: "Modification de la description de " + member.user.username + ".",
                    description: `<@${message.author.id}> vient juste d'éditer la description de <@${member.id}> :`,
                    fields: [{
                        name: "➜ Avant :",
                        value: `\`\`\`${db.desc}\`\`\``,
                        inline: false
                    }, {
                        name: "➜ Après :",
                        value: `\`\`\`none\`\`\``,
                        inline: false
                    }],
                    timestamp: new Date(),
                    footer: {
                        text: "ID du bot : " + member.id,
                        iconURL: member.user.displayAvatarURL()
                    }

                }]
            })
            message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
            db.desc = null;
            db.save();
        }
        if (args[1] === 'none' && !db.desc) return message.channel.send("**" + client.no + ' ➜ Tu m\'as demandé supprimer une description qui n\'a jamais été enregistrée ¯\\_(ツ)_/¯**')
        if (args[1] !== "none") {
            if (message.content.length > 300) return message.channel.send("**" + client.no + " ➜ Votre description ne doit pas dépasser les 300 caractères.**")
            client.channels.cache.get(botslogs).send({
                content: `<@${db.ownerID}>`,
                embeds: [{
                    color: client.color,
                    title: "Modification du profil...",
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
                    timestamp: new Date(),
                    description: `<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`,
                    fields: [{
                        name: "➜ Avant :",
                        value: `\`\`\`none\`\`\``,
                        inline: false
                    }, {
                        name: "➜ Après :",
                        value: `\`\`\`${args.slice(1).join(" ")}\`\`\``,
                        inline: false
                    }]
                }]
            })
            message.channel.send("**" + client.yes + " ➜ Modifications enregistrées avec succès !**")
            db.desc = args.slice(1).join(" ");
            db.save();
        }
    }
}

module.exports = new Setdesc;