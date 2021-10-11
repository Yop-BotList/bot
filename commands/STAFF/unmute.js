const { Client, Message, MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs, botslogs } = require("../../configs/channels.json"),
      botconfig = require("../../models/botconfig"),
      { modrole, bypass, mute } = require("../../configs/roles.json"),
      bots = require("../../models/bots");
const { findOne } = require('../../models/sanction');

module.exports = {
    name: 'unmute',
    aliases: [],
    categories : 'staff', 
    permissions : modrole, 
    description: 'Rendre la voix à un membre.',
    cooldown : 5,
    usage: 'unmute <id> <raison>',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const member = message.guild.members.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        if (!member.roles.cache.has(mute)) return message.reply(`**${client.no} ➜ Ce membre n'est pas muet.**`)
        const db = await botconfig.findOne();
        if (member.user.bot) {
            const db2 = await findOne({ botID: member.user.id })
            if (!db2) return message.reply(`**${client.no} ➜ Ce bot n'est pas sur ma liste.**`)
            try {
                member.roles.remove(mute)
            }
            catch {
                return message.reply(`**${client.no} ➜ Zut alors ! Je n'ai pas la permission de retirer le rôle \`${message.guild.roles.cache.get(mute).name}\` à \`${member.user.tag}\`.**`)
            }
            const e = new MessageEmbed()
            .setTitle("Suppression de sanction :")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.user.tag} ➜ ${member.user.id}\`\`\``)
            .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# MUTE\`\`\``)
            .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
            .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
            const e2 = new MessageEmbed()
            .setTitle("Rendu de voix...")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .setDescription(`Votre robot \`${member.user.tag}\` a récupéré la permission de parler.`)
            .setFooter("Pour demander une reprise de voix, veuillez m'envoyer un Message Privé.")
            client.channels.cache.get(botslogs).send({ content: `<@${db2.ownerID}>`, embeds: [e2] })
            client.channels.cache.get(modlogs).send({ embeds: [e] })
            return message.reply(`**${client.yes} ➜ ${member.user.tag} a bien récupéré la permission de parler !**`)
        }
        if (!member.user.bot) {
            try {
                member.roles.remove(mute)
            }
            catch {
                return message.reply(`**${client.no} ➜ Zut alors ! Je n'ai pas la permission de retirer le rôle \`${message.guild.roles.cache.get(mute).name}\` à \`${member.user.tag}\`.**`)
            }
            const e = new MessageEmbed()
            .setTitle("Suppression de sanction :")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.user.tag} ➜ ${member.user.id}\`\`\``)
            .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# MUTE\`\`\``)
            .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
            .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
            const e2 = new MessageEmbed()
            .setTitle("Suppression de sanction:")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTimestamp(new Date())
            .setDescription(`La sanction portant la raison suivante vient de vous être retiré :\n\`\`\`md\n${db.reason}\`\`\``)
            member.user.send({ embeds: [e2] }).catch(() => {
                e.addField(":warning: Avertissement :", "L'utilisateur n'a pas été prévenu(e) de la suppression de sa sanction !")
            })
            client.channels.cache.get(modlogs).send({ embeds: [e] })
            return message.reply(`**${client.yes} ➜ ${member.user.tag} a bien récupéré la permission de parler !**`)
        }
    }
}
