'use strict';

const Command = require('../../structure/Command.js');
const Discord = require('discord.js');
const config = require('../../config.json');

class Suggest extends Command {
    constructor() {
        super({
            name: 'suggest',
            category: 'utils',
            description: 'Faire une suggestion pour le serveur/le bot.',
            usage: 'suggest <suggestion>',
            example: ['suggest Autoriser à tous les membres l\'accès au <#784481268213612554>.'],
            aliases: ['suggestion']
        })
    }

    async run(client, message, args) {
        if (!args[1]) {
            message.channel.send('```y!suggest <suggestion>```')
        } else {
            let oui = '<a:oui:838334340618256384>'
            let bof = '<a:bof:838334339820945419>'
            let non = '<a:non:838334340160815104>'
            client.channels.cache.get('782661936370024489').send({
            embed: {
                title: `Nouvelle suggestion de ${message.author.username} !`,
                color: config.color,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                },
                description: `\`\`\`md\n# ${args.slice(1).join(' ')}\n\`\`\`\n**Réagissez :**\n${oui} = Oui\n${bof} = Pourquoi pas ?\n${non} = Non`
            }
        }).then(msg => {
            msg.react('838334340618256384')
            msg.react('838334339820945419')
            msg.react('838334340160815104')
            message.channel.send(':white_check_mark: Votre suggestion a bien été envoyée. Allez voir dans le <#782661936370024489>.')
        });
    }
    }
}

module.exports = new Suggest;