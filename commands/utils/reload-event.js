'use strict';

const Command = require("../../structure/Command.js");

class ReloadEvent extends Command {
    constructor() {
        super({
            name: 'reload-event',
            category: 'dev',
            description: 'Recharger un évènement.',
            usage: 'reload <évènement>',
            example: ['reload-event message','reload-event ready'],
            perms: "owner"
        });
    }

    async run(client, message, args) {
        if(!args[1]) {
            message.channel.send("> Veuillez préciser un évènement.");
        } else {
            client.reloadEvent(args[1]).then(async res => {
                await message.channel.send(res);
            });
        }
    }
}

module.exports = new ReloadEvent;