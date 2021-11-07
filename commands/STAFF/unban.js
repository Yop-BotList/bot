'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs } = require("../../configs/channels.json"),
      botconfig = require("../../models/botconfig"),
      { modrole, bypass } = require("../../configs/roles.json");

class Unban extends Command {
    constructor() {
        super({
            name: 'unban',
            category: 'staff',
            description: 'Débannir un utilisateur.',
            usage: 'unban <id>',
            example: ['unban 692374264476860507'],
            perms: 'BAN_MEMBERS',
            cooldown: 240,
            botPerms: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGES", "BAN_MEMBERS"]
        });
    }

    async run(client, message, args) {
        const member = await client.users.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        if (member.bot) return message.reply(`**${client.no} ➜ Cet utilisateur n’est pas humain.**`)
        if (!message.guild.bans.fetch(args[0])) return message.reply(`**${client.no} ➜ Zut alors ! Cet utilisateur n'est pas banni du serveur !**`)
        
        try {
            message.guild.bans.remove({ user: member.id, reason: "Débannissement effectué par " + message.author.tag })
        }
        catch {
            return message.reply(`**${client.no} ➜ Il m'est impossible de débannir cet utilisateur !**`)
        }
        
        const e = new MessageEmbed()
        .setTitle("Suppression de sanction :")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.tag} ➜ ${member.id}\`\`\``)
        .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# BAN\`\`\``)
        .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
        client.channels.cache.get(modlogs).send({ embeds: [e] })
        message.reply(`**${client.yes} ➜ ${member.tag} a été débanni avec succès !**`)
    }
}

module.exports = new Unban;