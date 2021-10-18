'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js")

class Cry extends Command {
    constructor() {
        super({
            name: 'cry',
            category: 'fun',
            description: 'Pleurer comme un gros bébé.',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const e = new MessageEmbed()
        .setDescription(`<@${message.author.id}> chiale comme un gros bébé ! Venez ||pas|| le consoler !`)
        .setTimestamp(new Date())
        .setImage("https://i.imgur.com/hqheDUi.gif")
        .setColor(client.color)
        
        message.reply({ content: null, embeds: [e] });
    }
}

module.exports = new Cry;
