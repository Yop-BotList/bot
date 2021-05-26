'use strict';

const Discord = require('discord.js');
const Command = require('../../structure/Command.js');
const config = require('../../config.json');
const Database = require("easy-json-database");

const dbProprio = new Database('./database/proprio.json'),
      dbLikes = new Database('./database/likes.json'),
      dbVerifStatut = new Database('./database/verifstatut.json')

class Reject extends Command {
    constructor() {
        super({
            name: 'reject',
            category: 'staff',
            description: 'Rejeter un bot de la liste.',
            usage: 'reject <id bot> <raison>',
            example: ['reject 782667133716791316 Aucune commande ne précise que vous êtes le/la propriétaire de ce bot.'],
        })
    }
    
    async run(client, message, args) {
        if (!args[1]) {
            message.channel.send('```y!reject <id bot> <raison>```')
        } else if (!message.member.roles.cache.get('782676062306959413')) {
            return message.channel.send(':no_entry_sign: Vous n\'avez pas la permission d\'utiliser cette commande.')
        } else if (args[1]) {
            if(args[1].length === 18 && !isNaN(parseInt(args[1]))) {
            const member = await client.users.fetch(`${args[1]}`);
                if (member.bot) {
                if (!dbVerifStatut.has(`Statut_${member.id}`)) {
                    return message.channel.send(':no_entry_sign: Aucune demande n\'a été faite pour ce bot.')
                } else {
                    if (args[2]) {
                    // Messages
                    client.channels.cache.get(config.logs1).send(`<@${dbProprio.get(`Proprio_${member.id}`)}>`, {
                        embed:{
                            title: 'Refus...',
                            timestamp: new Date(),
                            thumbnail: member.displayAvatarURL(),
                            color: '#FF0000',
                            footer: {
                                text: `Tu peux toujours corriger ce que ${message.author.username} demande et refaire une demande ^^`
                            },
                            description: `<@${dbProprio.get(`Proprio_${member.id}`)}> vient juste de refuser le bot ${member.username} pour la raison suivante :\n\`\`\`${args.slice(2).join(' ')}\`\`\``
                        }
                    });
                    message.channel.send(`:white_check_mark: Le bot ${member.username}#${member.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(2).join(' ')}\`\`\``)
                    
                    setTimeout(() => {
                            // Suppressions des variables
                            dbVerifStatut.delete(`Statut_${member.id}`);
                            dbProprio.delete(`Proprio_${member.id}`);
                            dbLikes.delete(`Likes_${member.id}`);
                        }, 1000 )
                    } else if (!args[2]) {
                        return message.channel.send(':no_entry_sign: Veuillez entrer un raison.')                        
                    }
                }
            } else {
                if (!member.bot) {
                    return message.channel.send(':no_entry_sign: Ce membre n\'est pas un bot.')
                }
            } 
            } else if (!args[1].length === 18 && !isNaN(parseInt(args[1]))) {
                return message.channel.send(':no_entry_sign: L\'identifiant est invalide.')
            } 
        }
    }
}

module.exports = new Reject;