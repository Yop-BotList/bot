'use strict';

const Command = require("../../structure/Command.js");

class ReloadCommand extends Command {
    constructor() {
        super({
            name: 'reload-cmd',
            category: 'dev',
            description: 'Recharger une commande.',
            usage: 'reload-cmd <commande>',
            example: ['reload-cmd help','reload-cmd ping'],
            aliases: 'rc',
            perms: "owner"
        });
    }

    async run(client, message, args) {
        if(!args[1]) {
            message.channel.send("> Veuillez entrer une commande.");
        } else {
            client.reloadCommand(args[1]).then(async res => {
                await message.channel.send(res);
            });
        }
    }
}

module.exports = new ReloadCommand;