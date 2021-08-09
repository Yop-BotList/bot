const { autokick } = require("../configs/config.json");

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('```y!reject <id bot> <raison>```')
    if (!message.member.roles.cache.get(client.verificator)) return message.channel.send(client.no + ' | Vous n\'avez pas la permission d\'utiliser cette commande.')
    let member = message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(client.no + " | L'identifiant entré est invalide, ou le membre n'est pas présent sur ce serveur.")
    if (!client.dbVerifStatut.has(`Statut_${member.user.id}`)) return message.channel.send(client.no + ' | Aucune demande n\'a été faite pour ce bot.')
    if (!args[1]) return message.channel.send(client.no + ' | Veuillez entrer un raison.')
        // Messages
        client.channels.cache.get(client.botlogs).send(`<@${client.dbProprio.get(`Proprio_${member.user.id}`)}>`, {
            embed:{
                title: 'Refus...',
                timestamp: new Date(),
                thumbnail: {
                    url: member.user.displayAvatarURL()
                },
                color: '#FF0000',
                footer: {
                    text: `Tu peux toujours corriger ce que ${message.author.username} demande et refaire une demande ^^`
                },
                description: `<@${message.author.id}> vient juste de refuser le bot ${member.user.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
            }
        });
        message.channel.send(client.yes + ` | Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
        
        setTimeout(() => {
                // Suppressions des variables
                client.dbVerifStatut.delete(`Statut_${member.user.id}`);
                client.dbProprio.delete(`Proprio_${member.user.id}`);
                client.dbProprio.delete(`Bot_${message.author.id}`);
                client.dbLikes.delete(`Likes_${member.user.id}`);
                // autokick
                if (autokick === true) return member.kick("Bot supprimé de la liste.")
            }, 1000 )
}

exports.help = {
    name: "reject",
    category: "staff",
    description: "Rejeter un bot de la liste.",
    usage: "reject <id bot> <raison>",
    example: [`reject 782667133716791316 Non respect des conditions.`]
}
