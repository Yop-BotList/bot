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
        const kiss = ["https://tenor.com/view/love-cheek-peck-kiss-anime-gif-17382412", "https://tenor.com/view/toloveru-unexpected-surprise-kiss-gif-5372258", "https://tenor.com/view/kiss-anime-shocked-blush-faint-gif-16477767", "https://tenor.com/view/love-anime-kiss-hot-damn-gif-9838409", "https://tenor.com/view/yes-love-couple-kiss-in-love-gif-15009390", "https://tenor.com/view/anime-kissing-kiss-love-gif-10356314", "https://tenor.com/view/anime-kiss-gif-13221050"],
              e = new MessageEmbed()
        .setTitle(`${message.author.username} embrasse ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage(kiss[Math.floor(Math.random() * kiss.length)])
        .setColor(client.color)
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] }); MessageEmbed
    }
}

module.exports = new Kiss;