'use strict';

const Discord = require('discord.js');
const Command = require('../../structure/Command.js');
const config = require('../../config.json');
const Database = require("easy-json-database");

const dbProprio = new Database('./database/proprio.json'),
      dbVerifStatut = new Database('./database/verifstatut.json')  

class Accept extends Command {
    constructor() {
        super({
            name: 'accept',
            category: 'staff',
            description: 'Accepter un bot dans la liste.',
            usage: 'accept <bot>',
            example: ['accept <@782667133716791316>'],
        })
    }
    
    async run(client, message, args) {
        if (!args[1]) {
            return message.channel.send('```y!accept <mention bot>```')
        } else if (!message.member.roles.cache.get('782676062306959413')) {
            return message.channel.send(':no_entry_sign: Vous n\'avez pas la permission d\'utiliser cette commande.')
        } else if (args[1]) {
            if(message.mentions.members.first()) {
            const member = message.mentions.members.first();
                if (member.user.bot) {
                if (!dbVerifStatut.has(`Statut_${member.user.id}`)) {
                    return message.channel.send(':no_entry_sign: Aucune demande n\'a été faite pour ce bot.')
                } else {
                    // Messages
                    client.channels.cache.get(config.logs1).send(`<@${dbProprio.get(`Proprio_${member.user.id}`)}>`, {
                        embed:{
                            title: 'Acceptation...',
                            timestamp: new Date(),
                            thumbnail: member.user.displayAvatarURL(),
                            color: '#00FF2A',
                            footer: {
                                text: 'Pense à laisser un avis au serveur via la commande y!avis ^^',
                            },
                            description: `<@${dbProprio.get(`Proprio_${member.user.id}`)}> vient juste d'accepter le bot ${member.user.username} !`
                        }
                    });
                    message.channel.send(`:white_check_mark: Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être accepté !`)
                    
                    setTimeout(() => {
                            // Suppressions des variables
                            dbVerifStatut.delete(`Statut_${member.user.id}`)
                        }, 1000 )
                }
            } else {
                if (!member.user.bot) {
                    return message.channel.send(':no_entry_sign: Ce membre n\'est pas un bot.')
                }
            } 
            } else if (!message.mentions.members.first()) {
                return message.channel.send(':no_entry_sign: Il me semble que vous n\'avez mentionné personne...')
            } 
        }
    }
}

module.exports = new Accept;