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
        const member = message.mentions.members.fisrt() || message.guild.members.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Qui souhaites-tu frapper ?**`)
        const slap = ["https://tenor.com/view/chikku-neesan-girl-hit-wall-stfu-anime-girl-smack-gif-17078255", "https://tenor.com/view/mm-emu-emu-anime-slap-strong-gif-7958720", "https://tenor.com/view/slap-handa-seishuu-naru-kotoishi-barakamon-anime-barakamon-gif-5509136", "https://tenor.com/view/fly-away-slap-smack-anime-mad-gif-17845941", "https://tenor.com/view/powerful-head-slap-anime-death-tragic-gif-14358509", "https://tenor.com/view/cass-will-anime-slap-gif-17342897", "https://tenor.com/view/in-your-face-slap-anime-angry-pissed-gif-19408787"],
              e = new MessageEmbed()
        .setTitle(`${message.author.id} frappe ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage(slap[Math.floor(Math.random() * slap.length)])
        .setColor(client.color)
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
    }
}

module.exports = new Slap;