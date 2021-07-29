const roles = require('../configs/roles.json');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send("```y!mute <id> <raison>```")
    if (!message.member.roles.cache.get(client.verificator)) return message.channel.send(client.no + " | Vous n'avez pas la permission de faire cela.")
    let member = message.guild.members.cache.get(args[0]);
    if (!member || !member.user.bot) return message.channel.send(client.no + " | Désolé, mais cet identifiant est invalide, ou alors, ce n'est pas un bot !")
    if (!client.dbProprio.has(`Proprio_${member.user.id}`)) return message.channel.send(client.no + " | Je ne retrouve pas ce bot sur ma liste.")
    if (member.roles.cache.get(roles.mute)) return message.channel.send(client.no + " | Ce bot est déjà muet.")
    if (!args[1]) return message.channel.send(client.no + " | Aucune raison entrée.")
    
    member.roles.add(roles.mute).catch((err) => {
        return message.channel.send(client.no + " | Impossible d'attribuer le rôle à ce membre.")
    })
                // Messages
                client.channels.cache.get(client.botlogs).send(`<@${client.dbProprio.get(`Proprio_${member.user.id}`)}>`, {
                    embed:{
                        title: 'Réduction au silence...',
                        timestamp: new Date(),
                        thumbnail: {
                            url: member.user.displayAvatarURL()
                        },
                        color: '#FF0000',
                        footer: {
                            text: "Vous pensez que c'est une erreur ? Ouvrez un ticket !"
                        },
                        description: `<@${message.author.id}> vient juste de rendre muet le bot ${member.user.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
                    }
                });
    message.channel.send(client.yes + ` | Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être rendu muet pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
}

exports.help = {
    name: "mute",
    category: "staff",
    description: "Réduire un bot au silence.",
    usage: "mute <id bot> <raison>",
    example: [`mute 782667133716791316 Système de niveaux non désactivable.`]
}