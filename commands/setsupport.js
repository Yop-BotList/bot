const { botslogs } = require('../configs/channels.json'),
      { verificator } = require('../configs/roles.json');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('```y!setsupport <id bot> <invitation | none>```')
    
    if (args[0].length != 18 && !isNaN(parseInt(args[0]))) return message.channel.send(client.no + ' | Aïe ! Ton identifiant est invalide :confused:.')
        const member = await client.users.fetch(`${args[0]}`)
        if (!client.dbProprio.has(`Proprio_${member.id}`)) return message.channel.send(client.no + ' | Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)')
        if (client.dbProprio.get(`Proprio_${member.id}`) !== message.author.id && !message.member.roles.cache.get(verificator)) return message.channel.send(client.no + " | Désolé, mais vous n'avez pas la permission d'utiliser cette commande")
        if (!args[1]) return message.channel.send(client.no + ' | Il faudrai peut-être entrer un lien non ?')
        if (args[1] === 'none' && client.dbSupport.has(`Support_${member.id}`)) {
            client.channels.cache.get(botslogs).send(`<@${client.dbProprio.get(`Proprio_${member.id}`)}>`, {
                embed: {
                    title: "Modification du profil...",
                    thumbnail: {
                        url: member.displayAvatarURL()
                    },
                    color: client.color,
                    timestamp: new Date(),
                    description: `<@${message.author.id}> vient juste d'éditer le lien du serveur support de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "❱ Avant :",
                            value: `\`\`\`${client.dbSupport.get(`Support_${member.id}`)}\`\`\``,
                            inline: false
                        },
                        {
                            name: "❱ Après :",
                            value: "```none```",
                            inline: false
                        }
                    ]
                }
            })
            message.channel.send(client.yes + " | Modifications enregistrées avec succès !")
            setTimeout(() => {
                return client.dbSupport.delete(`Support_${member.id}`)
            }, 2000)
        }
        if (args[1] === 'none' && !client.dbSupport.has(`Support_${member.id}`)) return message.channel.send(client.no + ' | Tu m\'as demandé supprimer un lien qui n\'a jamais été enregistré ¯\\_(ツ)_/¯')
        if (args[1] !== "none") {
            if (!args[1].startsWith('https://discord.gg/') || args[1] === "https://discord.gg/") return message.channel.send(client.no + " | Le lien entré est invalide. Je vous rappelle que le lien doit commencer par `https://discord.gg/`")
            if (!client.dbSupport.has(`Support_${member.id}`)) var before = "none"
            if (client.dbSupport.has(`Support_${member.id}`)) var before = client.dbSupport.get(`Support_${member.id}`)
            client.channels.cache.get(botslogs).send(`<@${client.dbProprio.get(`Proprio_${member.id}`)}>`, {
                embed: {
                    title: "Modification du profil...",
                    thumbnail: {
                        url: member.displayAvatarURL()
                    },
                    color: client.color,
                    timestamp: new Date(),
                    description: `<@${message.author.id}> vient juste d'éditer le lien du serveur support de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "❱ Avant :",
                            value: `\`\`\`${before}\`\`\``,
                            inline: false
                        },
                        {
                            name: "❱ Après :",
                            value: `\`\`\`${args[1]}\`\`\``,
                            inline: false
                        }
                    ]
                }
            })
            message.channel.send(client.yes + " | Modifications enregistrées avec succès !")
            setTimeout(() => {
                return client.dbSupport.set(`Support_${member.id}`, args[1])
            }, 2000)
        }
}

exports.help = {
    name: "setsupport",
    category: "botlist"
}
