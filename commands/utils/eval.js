'use strict';

const config = require('../../config.json');
const Discord = require('discord.js');
const Command = require('../../structure/Command');

class Eval extends Command {
    constructor() {
        super({
            name: 'eval',
            category: 'dev',
            description: 'Evaluer un code en DiscordJS.',
            usage: 'eval <code>',
            example: ['eval message.reply(\'Salut :wave:\')'],
            perms: 'owner'
        })
    }

    async run(client, message, args) {
        
        const code = args.slice('1').join(' ');
        const evaled = eval(code);
        message.channel.send({
            embed: {
                title: 'Évaluation d\'un code en Javascript :',
                color: config.color,
                timestamp: new Date(),
                fields: [
                    {
                        name: ':inbox_tray: Entrée :',
                        value: `\`\`\`js\n${args.slice('1').join(' ')}\`\`\``,
                        inline: false,
                    },
                    {
                        name: ':outbox_tray: Sortie :',
                        value: `\`\`\`js\n${evaled, {code: "js"}}\`\`\``,
                        inline: false,
                    },
                ]
            }
        });
    }
}


module.exports = new Eval;