const Discord = require('discord.js'),
      Database = require("easy-json-database");

const dbProprio = new Database('./database/proprio.json'),
      dbVerifStatut = new Database('./database/verifstatut.json');

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!accept <mention bot>```')
    } else if (!message.member.roles.cache.get(client.verificator)) {
        return message.channel.send(client.no + ' | Vous n\'avez pas la permission d\'utiliser cette commande.')
    } else if (args[0]) {
        if(message.mentions.members.first()) {
        const member = message.mentions.members.first();
            if (member.user.bot) {
            if (!dbVerifStatut.has(`Statut_${member.user.id}`)) {
                return message.channel.send(client.no + ' | Aucune demande n\'a été faite pour ce bot.')
            } else {
                // Messages
                client.channels.cache.get(client.botlogs).send(`<@${dbProprio.get(`Proprio_${member.user.id}`)}>`, {
                    embed:{
                        title: 'Acceptation...',
                        timestamp: new Date(),
                        thumbnail: member.user.displayAvatarURL(),
                        color: '#00FF2A',
                        footer: {
                            text: 'Pense à laisser un avis au serveur via la commande y!avis ^^',
                        },
                        description: `<@${message.author.id}> vient juste d'accepter le bot ${member.user.username} !`
                    }
                });
                message.channel.send(client.yes + ` | Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être accepté !`)
                
                setTimeout(() => {
                        // Suppressions des variables
                        dbVerifStatut.delete(`Statut_${member.user.id}`)
                    }, 1000 )
            }
        } else {
            if (!member.user.bot) {
                return message.channel.send(client.no + ' | Ce membre n\'est pas un bot.')
            }
        } 
        } else if (!message.mentions.members.first()) {
            return message.channel.send(client.no + ' | Il me semble que vous n\'avez mentionné personne...')
        } 
    }
}

exports.help = {
    name: "accept"
}