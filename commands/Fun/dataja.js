'use strict';

const Command = require("../../structure/Command.js")

class Dataja extends Command {
    constructor() {
        super({
            name: 'dataja',
            category: '',
            description: 'Don\'t ask to ask, just ask !',
            cooldown: 30
        });
    }

    async run(client, message, args) {
        message.reply('"Ne demande pas si tu peux demander, mais demande directement. Ça nous fait gagner du temps."\n*Source : <https://dontasktoask.com/>*')
        message.delete()
    }
}

module.exports = new Dataja;