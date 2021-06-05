const Discord = require('discord.js'),
      Database = require("easy-json-database");

const dbDesc = new Database('./database/description.json'),
      dbProprio = new Database('./database/proprio.json'),
      { botlogs } = require('../configs/channels.json'),
      { verificator } = require('../configs/roles.json');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('```setdesc <id bot> <description | none>```')
    
    if (args[0].length != 18 && !isNaN(parseInt(args[0]))) return message.channel.send(client.no + ' | Aïe ! Ton identifiant est invalide :confused:.')
        const member = client.users.fetch(`${args[0]}`)
        if (!message.member.roles.cache.get(verificator) || dbProprio.get(`Proprio_${member.id}`) !== message.author.id) return message.channel.send(client.no + " | Désolé, mais vous n'avez pas la permission d'utiliser cette commande")
        if (!dbProprio.has(`Proprio_${member.id}`)) return message.channel.send(client.no + ' | Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)')
        if (!args[1]) return message.channel.send(client.no + ' | Il faudrai peut-être entrer une description non ?')
        if (args[1] === 'none' && dbDesc.has(`Desc_${member.id}`)) {
            client.channels.cache.get(botlogs).send(`<@${dbProprio.get(`Proprio_${member.id}`)}>`, {
                embed: {
                    title: "Modification du profil...",
                    thumbnail: member.displayAvatarURL(),
                    color: client.color,
                    timestamp: new Date(),
                    description: `<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "❱ Avant :",
                            value: `\`\`\`${dbDesc.get(`Desc_${member.id}`)}\`\`\``,
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
            setTimeout(() => {
                return dbDesc.delete(`Desc_${member.id}`)
            }, 2000)
        }
        if (args[1] === 'none' && !dbDesc.has(`Desc_${member.id}`)) return message.channel.send(client.no + ' | Tu m\'as demandé supprimer une description que tu n\'as jamais enregistrée ¯\_(ツ)_/¯')
        if (args[1] !== "none") {
            if (!dbDesc.has(`Desc_${member.id}`)) var before = "none"
            if (dbDesc.has(`Desc_${member.id}`)) var before = dbDesc.get(`Desc_${member.id}`)
            client.channels.cache.get(botlogs).send(`<@${dbProprio.get(`Proprio_${member.id}`)}>`, {
                embed: {
                    title: "Modification du profil...",
                    thumbnail: member.displayAvatarURL(),
                    color: client.color,
                    timestamp: new Date(),
                    description: `<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "❱ Avant :",
                            value: `\`\`\`${before}\`\`\``,
                            inline: false
                        },
                        {
                            name: "❱ Après :",
                            value: `\`\`\`${args.slice(1).join(" ")}\`\`\``,
                            inline: false
                        }
                    ]
                }
            })
            setTimeout(() => {
                return dbDesc.set(`Desc_${member.id}`, args.slice(1).join(" "))
            }, 2000)
        }
}

exports.help = {
    name: "setdesc"
}