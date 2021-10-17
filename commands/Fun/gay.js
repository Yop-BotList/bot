'use strict';

const Command = require("../../structure/Command.js")

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
        message.channel.send(`**<a:Alerte:792846021876776980> ➜ Alerte à tout le monde ! <@${message.author.id}> est joyeux !**`)
        return message.delete()
    }
}

module.exports = new Gay;