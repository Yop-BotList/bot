'use strict';

const Command = require("../../structure/Command.js"),
      { alerte } = require("../../configs/emojis.json")

class Gay extends Command {
    constructor() {
        super({
            name: 'gay',
            category: 'fun',
            description: 'Avertir que vous êtes joyeux !',
            cooldown: 15
        });
    }

    async run(client, message, args) {
        message.channel.send(`**${alerte} ➜ Alerte à tout le monde ! <@${message.author.id}> est joyeux !**`)
        return message.delete()
    }
}

module.exports = new Gay;