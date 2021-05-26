'use strict';

const Command = require("../../structure/Command.js");
const config = require('../../config.json');
const Database = require('easy-json-database');

const dbtickets = new Database('./database/tickets.json')

class Ticketclose extends Command {
    constructor() {
        super({
            name: 't-close',
            category: 'staff',
            description: 'Fermer un ticket.',
            usage: 't-close <raison>',
            example: ['t-close Partenariat accepté !']
        });
    }


    async run(client, message, args) {
        if (!args[1]) {
            return message.channel.send('```y!t-close <raison>```')
        } else if (!message.channel.name.startsWith('🎫・ticket-')) {
            return message.channel.send(':no_entry_sign: Ce salon n\'est pas un ticket.')
        } else {
            const member = await client.users.fetch(`${dbtickets.get(`User_${message.channel.id}`)}`)
            client.channels.cache.get('837258757821038592').send({
                            embed: {
                                title: `Fermeture du ticket de ${member.username}#${member.discriminator}`,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: `:id: ID :`,
                                        value: `\`\`\`${member.id}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: `:newspaper2: Raison :`,
                                        value: `\`\`\`${args.slice(1).join(' ')}\`\`\``,
                                        inline: false                                        
                                    },
                                    {
                                        name: `:man_police_officer: Modérateur :`,
                                        value: `\`\`\`${message.author.username}#${message.author.discriminator}\`\`\``,
                                        inline: false                                        
                                    }
                                ]
                            }
                });
                message.channel.delete({ reason: `Fermeture du ticket de ${member.username}#${member.discriminator} par ${message.author.username}#${message.author.discriminator}`});
                setTimeout(() => {
                    dbtickets.delete(`User_${ch.id}`);
                }, 1000)
        }
    }
}

module.exports = new Ticketclose;