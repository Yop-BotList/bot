'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require("discord.js"),
      { verificator} = require("../../configs/roles.json");

class Invitegen extends Command {
    constructor() {
        super({
            name: 'invitegen',
            category: 'staff',
            description: 'Générer une invitation.',
            aliases: ["igen"],
            usage: 'invitegen <id>',
            example: ["invitegen 692374264476860507"],
            perms: verificator,
            cooldown: 5
        });
    }

    async run(client, message, args) {
        let member = await client.users.fetch(args[1]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
        if (member.bot === false) return message.reply(`**${client.no} ➜ Cet utilisateur n’est pas un robot.**`)
        const e = new MessageEmbed()
        .setTitle("Générateur de liens d’invitation :")
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setTimestamp(new Date())
        .setColor(client.color)
        .setDescription(`Pour obtenir le lien d’invitation de ${member.tag}, [cliquez ici](https://discord.com/oauth2/authorize?client_id=${member.id}&permissions=0&scope=bot%20applications.commands)`)
        message.reply({ embeds: [e] })
    }
}

module.exports = new Invitegen;