'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs, botslogs } = require("../../configs/channels.json"),
      botconfig = require("../../models/botconfig"),
      { modrole, bypass, mute } = require("../../configs/roles.json"),
      bots = require("../../models/bots");

class Mute extends Command {
    constructor() {
        super({
            name: 'mute',
            category: 'staff',
            description: 'Rendre muet un membre.',
            aliases: ["m"],
            usage: 'mute <id> <raison>',
            example: ["m 692374264476860507 Spam"],
            perms: modrole,
            cooldown: 60,
            botPerms: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGES", "MANAGE_ROLES"]
        });
    }

    async run(client, message, args) {
        const member = await message.guild.members.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply(`**${client.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`)
        if (member.roles.cache.has(bypass)) return message.reply(`**${client.no} ➜ Ce membre est imunisé contre les sanctions.**`)
        if (member.roles.cache.has(mute)) return message.reply(`**${client.no} ➜ Ce membre est déjà muet.**`)
        if (!args[1]) return message.reply(`**${client.no} ➜ Veuillez entrer une raison.**`)
        const db = await botconfig.findOne();
        if (member.user.bot) {
            const db2 = await bots.findOne({ botID: member.user.id })
            if (!db2) return message.reply(`**${client.no} ➜ Ce bot n'est pas sur ma liste.**`)
            try {
                member.roles.add(mute)
            }
            catch {
                return message.reply(`**${client.no} ➜ Zut alors ! Je n'ai pas la permission d'ajouter le rôle \`${message.guild.roles.cache.get(mute).name}\` à \`${member.user.tag}\`.**`)
            }
            const e = new MessageEmbed()
            .setTitle("Nouvelle sanction :")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.user.tag} ➜ ${member.user.id}\`\`\``)
            .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# MUTE\`\`\``)
            .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
            .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
            .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
            const e2 = new MessageEmbed()
            .setTitle("Réduction au silence...")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .setDescription(`Votre robot \`${member.user.tag}\` a été réduit au silence pour la raison suivante : \`\`\`${args.slice(1).join(" ")}\`\`\``)
            .setFooter("Pour demander une reprise de voix, veuillez m'envoyer un Message Privé.")
            client.channels.cache.get(botslogs).send({ content: `<@${db2.ownerID}>`, embeds: [e2] })
            client.channels.cache.get(modlogs).send({ embeds: [e] })
            return message.reply(`**${client.yes} ➜ ${member.user.tag} a été réduit au silence avec succès !**`)
        }
        if (!member.user.bot) {
            try {
                member.roles.add(mute)
            }
            catch {
                return message.reply(`**${client.no} ➜ Zut alors ! Je n'ai pas la permission d'ajouter le rôle \`${message.guild.roles.cache.get(mute).name}\` à \`${member.user.tag}\`.**`)
            }
            new warns({
                userID: member.user.id,
                modID: message.author.id,
                wrnID: Number(db.warns) + 1,
                reason: args.slice(1).join(" "),
                type: "MUTE",
                date: Date.now()
            }).save()
            const e = new MessageEmbed()
            .setTitle("Nouvelle sanction :")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.user.tag} ➜ ${member.user.id}\`\`\``)
            .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# MUTE\`\`\``)
            .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
            .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
            .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
            const e2 = new MessageEmbed()
            .setTitle("Nouvelle sanction :")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# MUTE\`\`\``)
            .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
            member.user.send({ embeds: [e2] }).catch(() => {
                e.addField(":warning: Avertissement :", "L'utilisateur n'a pas été prévenu(e) de sa santion !")
            })
            client.channels.cache.get(modlogs).send({ embeds: [e] })
            message.reply(`**${client.yes} ➜ ${member.user.tag} a été rendu muet avec succès !**`)
            return await botconfig.findOneAndUpdate({ $set: { warns: db.warns + 1 } }, { upsert: true })
        }
    }
}

module.exports = new Mute;