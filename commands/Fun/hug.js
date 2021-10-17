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
        const hug = ["https://tenor.com/view/anime-cute-hug-gif-14577424", "https://tenor.com/view/tackle-hug-couple-anime-cute-couple-love-gif-17023255", "https://tenor.com/view/hug-k-on-anime-cuddle-gif-16095203", "https://tenor.com/view/hug-anime-gif-19674705", "https://tenor.com/view/teria-wang-kishuku-gakkou-no-juliet-hug-anime-gif-16509980", "https://tenor.com/view/hug-anime-love-sweet-tight-hug-gif-7324587", "https://tenor.com/view/anime-choke-hug-too-tight-gif-14108949"],
              e = new MessageEmbed()
        .setTitle(`${message.author.id} fait un câlin à ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage(hug[Math.floor(Math.random() * hug.length)]) 
        .setColor(client.color)
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
    }
}

module.exports = new Hug;