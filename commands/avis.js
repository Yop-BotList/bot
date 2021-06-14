const Discord = require('discord.js'),
      Database = require("easy-json-database"),
      roles = require('../configs/roles.json'),
      { avischannel } = require('../configs/channels.json');

const dbAvis = new Database('./database/avis.json');

exports.run = async (client, message, args) => {
    if (message.member.roles.cache.get(roles.client)) {
        if (dbAvis.has(`Avis_${message.author.id}`)) {
            return message.channel.send(client.no + ' | Vous avez déjà envoyé un avis. Veuillez ouvrir un ticket (`y!ticket`) pour le modifier.')
        } else 
        if (!args[1]) {
            message.channel.send(client.no + ' | Veuillez entrer un avis à laisser.')
        } else client.channels.cache.get(avischannel).send({
            embed: {
                title: `Avis de ${message.author.username} sur la vérification de son robot :`,
                color: config.color,
                footer: {
                    icon_url: message.author.displayAvatarURL(),
                },
                timestamp: new Date(),
                thumbnail: {
                    url: message.author.displayAvatarURL(),
                },
                description: `\`\`\`py\n"${args.slice(1).join(' ')}"\`\`\``,
            }
        }).then(msg => {
            msg.react('💜')
            message.channel.send(client.yes + ' | Votre avis a bien été envoyé !')
            dbAvis.set(`Avis_${message.author.id}`, `${args.slice(1).join(' ')}`)
        })
    } else message.channel.send(client.no + ' | Vous devez être avoir le rôle `👤 • Client` pour utiliser cette commande.')
}

exports.help = {
    name: "avis",
    category: "utils"
}