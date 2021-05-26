'use strict';

const Command = require("../../structure/Command.js");
const config = require('../../config.json');
const Database = require('easy-json-database');

const dbtickets = new Database('./database/tickets.json')

class Ticketadd extends Command {
    constructor() {
        super({
            name: 't-add',
            category: 'staff',
            description: 'Ajouter un membre à un ticket.',
            usage: 't-add <id> <raison>',
            example: ['t-add 650664078649458699 Membre concerné par le partenariat.']
        });
    }


    async run(client, message, args) {
        if (!args[1]) {
            return message.channel.send('```y!t-add <id> <raison>```')
        } else if (message.channel.name.startsWith('🎫・ticket-')) {    
                    if (message.member.roles.cache.get('783669284207198218')) {
                        if (!args[1]) {
                            return message.channel.send(':no_entry_sign: Veuillez renseigner l\'identifiant d\'un utilisateur.')
                        } else if (!args[2]) {
                            return message.channel.send(':no_entry_sign: Pourquoi voulez-vous ajouter un utilisateur à ce ticket ?')
                        } else if (!args[1].length === 18 && !isNaN(parseInt(args[1]))) {
                            return message.channel.send(':no_entry_sign: L\'identifiant entré est invalide.')
                        } else {
                            const member = await client.users.fetch(`${args[1]}`);
                            message.channel.updateOverwrite(member, {
                            'VIEW_CHANNEL': true
                        })
                        const user = await client.users.fetch(`${dbtickets.get(`User_${message.channel.id}`)}`);
                        client.channels.cache.get('837258757821038592').send({
                            embed: {
                                title: `Ajout d'un membre au ticket de ${user.username}#${user.discriminator}`,
                                timestamp: new Date(),
                                fields: [
                                    {
                                        name: `:bust_in_silhouette: Utilisateur :`,
                                        value: `\`\`\`${member.username}#${member.discriminator}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: `:newspaper2: Raison :`,
                                        value: `\`\`\`${args.slice(2).join(' ')}\`\`\``,
                                        inline: false                                        
                                    },
                                    {
                                        name: `:man_police_officer: Modérateur :`,
                                        value: `\`\`\`${message.author.username}#${message.author.discriminator}\`\`\``,
                                        inline: false                                        
                                    }
                                ]
                            }
                        })
                        message.channel.send(`J'ai bien ajouté\`${member.username}#${member.discriminator}\` à ce ticket.`)
                        }
                    } else if (!message.member.roles.cache.get('783669284207198218')) {
                        return message.channel.send(':no_entry_sign: Vous n\'avez pas la permission de faire cela.') 
                    }
                } else if (!message.channel.name.startsWith('🎫・ticket-'))  {
                    return message.channel.send(':no_entry_sign: Ce salon n\'est pas un ticket !')
                }
    }
}

module.exports = new Ticketadd;