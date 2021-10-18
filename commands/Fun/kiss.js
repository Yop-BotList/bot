'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js")

class Kiss extends Command {
    constructor() {
        super({
            name: 'kiss',
            category: 'fun',
            description: 'Faire un bisou à quelqu\'un.',
            usage: 'kiss <mention>',
            example: ["kiss <@692374264476860507>"],
            cooldown: 10
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply(`**${client.no} ➜ Qui souhaites-tu embrasser ?**`)
        const e = new MessageEmbed()
        .setDescription(`<@${message.author.id}> embrasse ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage("https://i.imgur.com/GTeWgtB.gif")
        .setColor(client.color)
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] }); MessageEmbed
    }
}

module.exports = new Kiss;
