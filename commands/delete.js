const { autokick } = require("../configs/config.json");

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('```y!delete <id bot> <raison>```')
    if (!message.member.roles.cache.get(client.verificator)) return message.channel.send(client.no + ' | Vous n\'avez pas la permission d\'utiliser cette commande.')
    let member = message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(client.no + " | Identifiant invalide ou alors, le membre n'est pas présent sur le serveur.");
    if (!member.user.bot) return message.channel.send(client.no + " Ce membre n'est pas un bot.");
    if (!client.dbProprio.has(`Proprio_${member.user.id}`)) return message.channel.send(client.no + ' | Ce bot n\'est pas sur la liste !')
    if (client.dbVerifStatut.has(`Statut_${member.user.id}`)) return message.channel.send(client.no + ' | Ce bot n\'est pas encore sur la liste !')
    if (!args[1]) return message.channel.send(client.no + ' | Veuillez entrer un raison.')     
        // Messages
        client.channels.cache.get(client.botlogs).send(`<@${client.dbProprio.get(`Proprio_${member.user.id}`)}>`, {
            embed:{
                title: 'Suppression...',
                timestamp: new Date(),
                thumbnail: {
                    url: member.user.displayAvatarURL()
                },
                color: '#FF0000',
                footer: {
                    text: "Vous pensez que c'est une erreur ? Ouvrez un ticket !"
                },
                description: `<@${message.author.id}> vient juste de supprimer le bot ${member.user.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
            }
        });
        message.channel.send(client.yes + ` | Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être supprimé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)

        setTimeout(() => {
                // Suppressions des variables
                client.dbProprio.delete(`Proprio_${member.user.id}`);
                client.dbProprio.delete(`Bot_${message.author.id}`);
                client.dbLikes.delete(`Likes_${member.user.id}`);
                // autokick
                if (autokick === true) return member.kick("Bot supprimé de la liste.")
            }, 1000 )
}

exports.help = {
    name: "delete",
    category: "staff",
    description: "Supprimer un bot de la liste.",
    usage: "delete <id bot> <raison>",
    example: [`delete 782667133716791316 Le créateur a quitté le serveur.`]
}
