'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js")

class Hug extends Command {
    constructor() {
        super({
            name: 'hug',
            category: 'fun',
            description: 'Faire un câlin à quelqu\'un.',
            usage: 'hug <mention>',
            example: ["hug <@692374264476860507>"],
            cooldown: 10
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply(`**${client.no} ➜ À qui souhaites-tu faire un câlin ?**`)
        const e = new MessageEmbed()
        .setTitle(`<@${message.author.id}> fait un câlin à ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage("https://i.imgur.com/TuMgJw0.gif") 
        .setColor(client.color)
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
    }
}

module.exports = new Hug;
