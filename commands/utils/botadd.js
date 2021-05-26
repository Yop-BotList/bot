'use strict';

const Discord = require('discord.js'),
      Command = require('../../structure/Command.js'),
      config = require('../../config.json'),
      Database = require("easy-json-database")

const dbPrefix = new Database('./database/prefix.json'),
      dbProprio = new Database('./database/proprio.json'),
      dbVerifStatut = new Database('./database/verifstatut.json')

class Botadd extends Command {
    constructor() {
        super({
            name: 'botadd',
            category: 'botlist',
            description: 'Ajouter un bot dans la liste.',
            usage: 'botadd <id bot> <préfixe>',
            example: ['botadd 782667133716791316 y!'],
        })
    }
    
    async run(client, message, args) {
         if (!args[1]) {
            return message.channel.send('```y!botadd <id bot> <préfixe>```')
        }
        else if (message.mentions.members.first()) {
            return message.channel.send(`Désolé <@${message.author.id}>, mais je ne prends pas en charge les mentions. Essaies plutôt avec un identifiant !`)
        }
        else if (args[1].length === 18 && !isNaN(parseInt(args[1]))) {
            let prefix = '.'
            let proprio = '.'
            const member = await client.users.fetch(`${args[1]}`);
                if (member.bot) {
                if (dbProprio.has(`Proprio_${member.id}`)) {
                    return message.channel.send(':no_entry_sign: Désolé, mais ce bot est déjà sur la liste.')
                } else {
                    proprio = message.author.id
                }
        
                if (args[2]) {
                    if(dbPrefix.has(`Prefix_${args[1]}`)) {
                        prefix = args[2]
                    } else { 
                        prefix = args[2]
                    }
                }
                else if (!args[2]) {
                    return message.channel.send(':no_entry_sign: Il ne me semble pas que tu aies renseigné un préfixe...')
                }
            }
            else if (!member.bot) {
                return message.channel.send('Le jour où les humains seront des bots, moi je porterais une culotte dans la rue !\nEssaie avec l\'identifiant d\'un bot :wink:')
            }
            if (prefix === '.') return;
            if (proprio === '.') return;
            
            // Création des variables :
            dbProprio.set(`Proprio_${member.id}`, `${proprio}`)
            dbPrefix.set(`Prefix_${member.id}`, `${prefix}`)
            dbVerifStatut.set(`Statut_${member.id}`, '.')
            //Message réponses
            client.channels.cache.get(config.logs1).send(`<@${message.author.id}>`, {
                embed:{
                    title: 'Demande d\'ajout...',
                    timestamp: new Date(),
                    thumbnail: member.displayAvatarURL(),
                    color: '#66DA61',
                    description: `<@${message.author.id}> a demandé à ajouter le bot [${member.username}#${member.discriminator}](https://discord.com/oauth2/authorize?client_id=${member.id}&scope=bot&permissions=0). Un vérificateur va bientôt s’occuper de lui.`
                }
            });
            message.channel.send(':white_check_mark: Votre bot a bien été ajouté à la liste d’attente !')
        } else if (args[1].length != 18 && !isNaN(parseInt(args[1]))) {
            return message.channel.send(':no_entry_sign: Aïe ! Ton identifiant est invalide :confused:.')
        }
    }
}

module.exports = new Botadd;