exports.run = async (client, message, args) => {
    if (!args[0]) {
        message.channel.send('```y!delete <id bot> <raison>```')
    } else if (!message.member.roles.cache.get(client.verificator)) {
        return message.channel.send(client.no + ' | Vous n\'avez pas la permission d\'utiliser cette commande.')
    } else if (args[0]) {
        if(args[0].length === 18 && !isNaN(parseInt(args[0]))) {
        const member = await client.users.fetch(`${args[0]}`);
            if (member.bot) {
            if (!client.dbProprio.has(`Proprio_${member.id}`)) {
                return message.channel.send(client.no + ' | Ce bot n\'est pas sur la liste !')
            } 
            if (client.dbVerifStatut.has(`Statut_${member.id}`) ) {
                return message.channel.send(client.no + ' | Ce bot n\'est pas sur la liste !')
            } else {
                if (args[1]) {
                // Messages
                client.channels.cache.get(client.botlogs).send(`<@${client.dbProprio.get(`Proprio_${member.id}`)}>`, {
                    embed:{
                        title: 'Suppression...',
                        timestamp: new Date(),
                        thumbnail: {
                            url: member.displayAvatarURL()
                        },
                        color: '#FF0000',
                        footer: {
                            text: "Vous pensez que c'est une erreur ? Ouvrez un ticket !"
                        },
                        description: `<@${message.author.id}> vient juste de supprimer le bot ${member.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
                    }
                });
                message.channel.send(client.yes + ` | Le bot ${member.username}#${member.discriminator} vient bien d'être supprimé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)

                setTimeout(() => {
                        // Suppressions des variables
                        client.dbProprio.delete(`Proprio_${member.id}`);
                        client.dbLikes.delete(`Likes_${member.id}`);
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
    name: "delete",
    category: "staff",
    description: "Supprimer un bot de la liste.",
    usage: "delete <id bot> <raison>",
    example: [`delete 782667133716791316 Le créateur a quitté le serveur.`]
}