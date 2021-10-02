const { Client, Message, MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs } = require("../../configs/channels.json"),
      botconfig = require("../../models/botconfig"),
      { modrole, bypass } = require("../../configs/roles.json");

module.exports = {
    name: 'warn',
    aliases: ['w'],
    categories : 'staff', 
    permissions : modrole, 
    description: 'Avertir un membre.',
    cooldown : 5,
    usage: 'warn <id> <raison>',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const member = client.users.cache.get(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        if (member.bot) return message.reply(`**${client.no} ➜ Ce membre n’est pas humain.**`)
        if (!args[1]) return message.reply(`**${client.no} ➜ Veuillez entrer une raison.**`)
       const db = botconfig.findOne()
        
        new warns({
            userID: member.id,
            modID: message.author.id,
            wrnID: db.warns + 1,
            reason: args.slice(1).join(" "),
            type: "WARN",
            date: Date.now()
        }).save()
        
        const e = new MessageEmbed()
        .setTitle("Nouvelle sanction :")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.tag} ➜ ${member.id}\`\`\``)
        .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# WARN\`\`\``)
        .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
        .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
        .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
        const e2 = new MessageEmbed()
        .setTitle("Nouvelle sanction :")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# WARN\`\`\``)
        .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${args.slice(1).join(" ")}\`\`\``)
        member.send({ embeds: [e2] }).catch(() => {
            e.addField(":warning: Avertissement :", "L'utilisateur n'a pas été prévenu(e) de sa santion !")
        })
        client.channels.cache.get(modlogs).send({ embeds: [e] })
        message.reply(`**${client.yes} ➜ ${member.tag} a été averti avec succès !**`)
    }
}
