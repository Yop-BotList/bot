'use strict';

const Command = require("../../structure/Command.js");
const config = require('../../config.json');
const Database = require('easy-json-database');

const dbtickets = new Database('./database/tickets.json')

class Ticketcreate extends Command {
    constructor() {
        super({
            name: 't-create',
            category: 'utils',
            description: 'Créer un ticket.',
            usage: 't-create <raison>',
            example: ['t-create Partenariat'],
            aliases: ['t-new', 't-open']
        });
    }


    async run(client, message, args) {
        if (!args[1]) {
            return message.channel.send('```y!t-create <raison>```')
        } else {
            if (message.channel.id === '782660206583611403') {
                    let guild = message.guild;
                    let categorie = await message.guild.channels.cache.find(c => c.id === "827792614106988554" && c.type === "category");

                    guild.channels.create(`🎫・ticket-${message.author.username}`, {
                        type: 'text',
                        parent: categorie.id,
                        permissionOverwrites: [
                            {
                                allow: 'VIEW_CHANNEL',
                                id: message.author.id
                            },
                            {
                                deny: 'VIEW_CHANNEL',
                                id: guild.id
                            },
                            {
                                allow: 'VIEW_CHANNEL',
                                id: '829348127345344584'
                            }
                        ]
                    }).then(ch => {
                        ch.send('`@here`').then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 500)
                        });
                        ch.send({
                            embed: {
                                title: `Nouveau ticket de ${message.author.username}#${message.author.discriminator}`,
                                timestamp: new Date(),
                                color: config.color,
                                footer: {
                                    text: 'Un membre du STAFF va bientôt arriver. Veuillez exposer votre demande maintenant.'
                                },
                                fields: [
                                    {
                                        name: `:id: ID :`,
                                        value: `\`\`\`${message.author.id}\`\`\``,
                                        inline: false                                        
                                    },
                                    {
                                        name: `:newspaper2: Raison :`,
                                        value: `\`\`\`${args.slice(1).join(' ')}\`\`\``,
                                        inline: false                                        
                                    },
                                ]
                            }
                        })
                        message.channel.send('Votre ticket a bien été créé. Jetez un coup d\'œil au salon dans lequel je viens de vous mentionner :wink: !');
                        client.channels.cache.get('837258757821038592').send({
                            embed: {
                                title: `Nouveau ticket de ${message.author.username}#${message.author.discriminator}`,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: `:id: ID :`,
                                        value: `\`\`\`${message.author.id}\`\`\``,
                                        inline: false                                        
                                    },
                                    {
                                        name: `:newspaper2: Raison :`,
                                        value: `\`\`\`${args.slice(1).join(' ')}\`\`\``,
                                        inline: false                                        
                                    },
                                ]
                            }
                        });
                        dbtickets.set(`User_${ch.id}`, `${message.author.id}`);
                    }).catch(err => console.log(err));
                } else if (!message.channel.id === '782660206583611403') {
                return message.channel.send(`:no_entry_sign: Cette commande est restreinte au <#782660206583611403>.`)
            }
            }
    }
}

module.exports = new Ticketcreate;