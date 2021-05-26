'use strict';

const Command = require("../../structure/Command.js");

class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            category: 'utils',
            description: 'Recevoir la latence du bot.',
            usage: 'ping',
            example: ['ping'],
            aliases: ['latance']
        });
    }

    async run(client, message) {
        await message.channel.send('Pong :ping_pong:').then(msg => {
            msg.edit(`Pong :ping_pong: \`${Math.sqrt(((new Date() - message.createdTimestamp)/(5*2))**2)} ms\``)
        });
    }
}

module.exports = new Ping;