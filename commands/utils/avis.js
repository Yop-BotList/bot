'use strict';

const Discord = require('discord.js');
const Command = require('../../structure/Command.js');
const config = require('../../config.json');
const Database = require("easy-json-database");

const dbAvis = new Database('./database/avis.json')

class Avis extends Command {
    constructor() {
        super({
            name: 'avis',
            category: 'client',
            description: 'Ajouter un avis sur le serveur ainsi que sur la vérification de votre robot.',
            usage: 'avis <avis>',
            example: ['avis Très bon serveur. Je recommende !'],
            aliases: ['review']
        })
    }
    
    async run(client, message, args) {
        if (message.member.roles.cache.get('784480914587254795')) {
            if (dbAvis.has(`Avis_${message.author.id}`)) {
                return message.channel.send(':no_entry_sign: Vous avez déjà envoyé un avis. Veuillez ouvrir un ticket (`y!ticket`) pour le modifier.')
            } else dbAvis.set(`Avis_${message.author.id}`, `${args.slice(1).join(' ')}`)
            if (!args[1]) {
                message.channel.send(':no_entry_sign: Veuillez entrer un avis à laisser.')
            } else client.channels.cache.get('784481268213612554').send({
                embed: {
                    title: `Avis de ${message.author.username} sur la vérification de son robot :`,
                    color: config.color,
                    footer: {
                        icon_url: message.author.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                    thumbnail: {
                        url: message.guild.iconURL({ dynamic: true }),
                    },
                    description: `\`\`\`py\n"${args.slice(1).join(' ')}"\`\`\``,
                }
            }).then(msg => {
                msg.react('💜')
                message.channel.send(':white_check_mark: Votre avis a bien été envoyé !')
            })
        } else message.channel.send(':no_entry_sign: Vous devez être avoir le rôle `👤 • Client` pour utiliser cette commande.')
    }
}

module.exports = new Avis;