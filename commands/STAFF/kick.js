'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs } = require("../../configs/channels.json"),
      botconfig = require("../../models/botconfig"),
      { modrole, bypass } = require("../../configs/roles.json");

class Kick extends Command {
    constructor() {
        super({
            name: 'kick',
            category: 'staff',
            description: 'Expulser un membre du serveur.',
            aliases: ["k"],
            usage: 'kick <id> <raison>',
            example: ["kick 692374264476860507 Spam"],
            perms: 'KICK_MEMBERS',
            cooldown: 120,
            botPerms: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGES", "KICK_MEMBERS"]
        });
    }

    async run(client, message, args) {
        const member = await message.guild.members.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        if (member.user.bot) return message.reply(`**${client.no} ➜ Ce membre n’est pas humain.**`)
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply(`**${client.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`)
        if (member.roles.cache.has(bypass)) return message.reply(`**${client.no} ➜ Ce membre est imunisé contre les sanctions.**`)
        if (!member.kickable) return message.reply(`**${client.no} ➜ Zut alors ! Je ne peux pas expluser ce membre ! Essaie peut-être de mettre mon rôle un peu plus haut dans la hiérarchie du serveur :p**`)
        if (!args[1]) return message.reply(`**${client.no} ➜ Veuillez entrer une raison.**`)
        const db = await botconfig.findOne()
        
        new warns({
            userID: member.user.id,
            modID: message.author.id,
            wrnID: Number(db.warns) + 1,
            reason: args.slice(1).join(" "),
            type: "KICK",
            date: Date.now()
        }).save()
        await botconfig.findOneAndUpdate({}, { $set: { warns: db.warns + 1 } }, { upsert: true })
        
        const e = new MessageEmbed()
        .setTitle("Nouvelle sanction :")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.user.tag} ➜ ${member.user.id}\`\`\``)
        .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# KICK\`\`\``)
        .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
        .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
        .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
        const e2 = new MessageEmbed()
        .setTitle("Nouvelle sanction :")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# KICK\`\`\``)
        .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
        member.user.send({ embeds: [e2] }).catch(() => {
            e.addField(":warning: Avertissement :", "L'utilisateur n'a pas été prévenu(e) de sa santion !")
        })
        member.kick({ reason: args.slice(1).join(" ") })
        client.channels.cache.get(modlogs).send({ embeds: [e] })
        message.reply(`**${client.yes} ➜ ${member.user.tag} a été explusé avec succès !**`)
    }
}

module.exports = new Kick;