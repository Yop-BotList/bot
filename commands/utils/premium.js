'use strict';

const Discord = require('discord.js');
const config = require('../../config.json');
const Command = require('../../structure/Command.js');

class Premium extends Command {
    constructor() {
        super({
            name: 'premium',
            category: 'utils',
            description: 'Voir des informations sur le rôle <@&783375866452508692>.',
            usage: 'premium',
            example: ['premium']
        })
    }
    
    async run(client, message) {
        message.channel.send({
            embed: {
                title: 'Grade Premium...',
                color: config.color,
                timestamp: new Date(),
                footer: {
                    icon_url: message.author.displayAvatarURL(),
                },
                fields: [
                    {
                        name: 'Obtention :',
                        value: 'Le grade <@&783375866452508692> ne peut pas être obtenu gratuitement. \nVous pouvez avoir ce rôle en invitant 10 personnes (_voir `+ranks`_) ou en "bumpant" le serveur 15 fois avec la commande `!d bump` (_voir `br.ranks`_).',
                        inline: false,
                    },
                    {
                        name: 'Avantages :',
                        value: '• Mention supplémentaire au bout d’une semaine d’ajout.\n• 2 bots.\n• Ajout d’un salon d’annonces dans le <#783013505225719829>.\n• Le grade <@&793543495599915069> pour tout vos bots.',
                        inline: false,
                    }
                ],
            }
        });
    }
}

module.exports = new Premium;