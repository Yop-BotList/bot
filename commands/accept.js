const role = require('../configs/roles.json'),
      Discord = require("discord.js")

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('```y!accept <mention bot>```')
    if (!message.member.roles.cache.get(client.verificator)) return message.channel.send(client.no + ' | Vous n\'avez pas la permission d\'utiliser cette commande.')
    if (!message.mentions.members.first()) return message.channel.send(client.no + " | Votre mention est invalide, ou l'utilisateur n'est pas présent sur le serveur.")
    const member = message.mentions.members.first();
    if (!member.user.bot) return message.channel.send(client.no + " | Cet utilisateur n'est pas un bot !")
    if (!client.dbVerifStatut.has(`Statut_${member.user.id}`)) return message.channel.send(client.no + ' | Aucune demande n\'a été faite pour ce bot.')
        // Messages
        client.channels.cache.get(client.botlogs).send(`<@${client.dbProprio.get(`Proprio_${member.user.id}`)}>`, {
            embed:{
                title: 'Acceptation...',
                timestamp: new Date(),
                thumbnail: {
                    url: member.user.displayAvatarURL()
                },
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
                client.dbVerifStatut.delete(`Statut_${member.user.id}`)
                // Don des rôles
                let proprio = message.guild.members.cache.get(client.dbProprio.get(`Proprio_${member.user.id}`))
                proprio.roles.add(role.client);
                member.roles.remove(role.botintests);
                member.roles.add(role.listedbot);
            }, 1000)
}

exports.help = {
    name: "accept",
    category: "staff",
    description: "Accepter un bot sur la liste.",
    usage: "accept <mention bot>",
    example: [`accept <@782667133716791316>`]
}