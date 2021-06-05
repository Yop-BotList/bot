const Discord = require('discord.js'),
      Database = require("easy-json-database");

const dbProprio = new Database('./database/proprio.json'),
      dbLikes = new Database('./database/likes.json'),
      dbVerifStatut = new Database('./database/verifstatut.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        message.channel.send('```y!reject <id bot> <raison>```')
    } else if (!message.member.roles.cache.get(client.verificator)) {
        return message.channel.send(client.no + ' | Vous n\'avez pas la permission d\'utiliser cette commande.')
    } else if (args[0]) {
        if(args[0].length === 18 && !isNaN(parseInt(args[0]))) {
        const member = await client.users.fetch(`${args[0]}`);
            if (member.bot) {
            if (!dbVerifStatut.has(`Statut_${member.id}`)) {
                return message.channel.send(client.no + ' | Aucune demande n\'a été faite pour ce bot.')
            } else {
                if (args[1]) {
                // Messages
                client.channels.cache.get(client.botlogs).send(`<@${dbProprio.get(`Proprio_${member.id}`)}>`, {
                    embed:{
                        title: 'Refus...',
                        timestamp: new Date(),
                        thumbnail: member.displayAvatarURL(),
                        color: '#FF0000',
                        footer: {
                            text: `Tu peux toujours corriger ce que ${message.author.username} demande et refaire une demande ^^`
                        },
                        description: `<@${message.author.id}> vient juste de refuser le bot ${member.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
                    }
                });
                message.channel.send(client.yes + ` | Le bot ${member.username}#${member.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
                
                setTimeout(() => {
                        // Suppressions des variables
                        dbVerifStatut.delete(`Statut_${member.id}`);
                        dbProprio.delete(`Proprio_${member.id}`);
                        dbLikes.delete(`Likes_${member.id}`);
                    }, 1000 )
                } else if (!args[1]) {
                    return message.channel.send(client.no + ' | Veuillez entrer un raison.')                        
                }
            }
        } else {
            if (!member.bot) {
                return message.channel.send(client.no + ' | Ce membre n\'est pas un bot.')
            }
        } 
        } else if (!args[0].length === 18 && !isNaN(parseInt(args[0]))) {
            return message.channel.send(client.no + ' | L\'identifiant est invalide.')
        } 
    }
}

exports.help = {
    name: "reject",
    category: "staff"
}
