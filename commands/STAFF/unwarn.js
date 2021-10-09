const { Client, Message, MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs } = require("../../configs/channels.json"),
      { modrole } = require("../../configs/roles.json");

module.exports = {
    name: 'unwarn',
    categories : 'staff', 
    permissions : modrole, 
    description: 'Supprimer un avertissement.',
    cooldown : 5,
    usage: 'unwarn <warn id>',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if (!parseInt(args[0])) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        const db = await warns.findOne({ wrnID: Number(args[0]) });
        if (!db) return message.reply(`**${client.no} ➜ Sanction introuvable !**`)
        const member = await client.users.fetch(db.userID);       
        const e = new MessageEmbed()
        .setTitle("Suppression de sanction :")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${member.tag} ➜ ${member.id}\`\`\``)
        .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# WARN\`\`\``)
        .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# ${db.reason}\`\`\``)
        .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
        .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
        const e2 = new MessageEmbed()
        .setTitle("Suppression de sanction :")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .setDescription(`L'avertissement portant la raison suivante vient de vous être retiré :\n\`\`\`md\n${db.reason}\`\`\``)
        member.send({ embeds: [e2] }).catch(() => {
            e.addField(":warning: Avertissement :", "L'utilisateur n'a pas été prévenu(e) de la suppression de sa sanction !")
        })
        client.channels.cache.get(modlogs).send({ embeds: [e] })
        await warns.findOneAndDelete({ warns: Number(args[0]) });
        message.reply(`**${client.yes} ➜ Avertissement supprimé avec succès !**`)
    }
}
