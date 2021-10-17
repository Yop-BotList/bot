'use strict';

const Command = require("../../structure/Command.js")

class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            category: 'utils',
            description: 'Recevoir la latence du bot.',
            aliases: ['latence']
        });
    }

    async run(client, message, args) {
        await message.channel.send(`Pong :ping_pong: \`${Date.now() - message.createdTimestamp} ms\``);
    }
}

module.exports = new Ping;