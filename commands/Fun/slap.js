'use strict';

const Command = require("../../structure/Command.js"),
     { MessageEmbed } = require("discord.js")

class Slap extends Command {
    constructor() {
        super({
            name: 'slap',
            category: 'fun',
            description: 'Frapper qulqu\'un.',
            aliases: ["punch"],
            usage: 'slap <mention>',
            example: ["slap <@692374264476860507>"],
            cooldown: 10
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Qui souhaites-tu frapper ?**`)
        const e = new MessageEmbed()
        .setDescription(`<@${message.author.id}> frappe ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage("https://i.imgur.com/7NIq25q.gif")
        .setColor(client.color)
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
    }
}

module.exports = new Slap;
