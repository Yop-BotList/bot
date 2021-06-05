const Database = require('easy-json-database'),
      { ticketsaccess } = require('../configs/roles.json'),
      { ticketslogs } = require('../configs/channels.json');

const dbtickets = new Database('./database/tickets.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!t-add <id> <raison>```')
    } else if (message.channel.name.startsWith('🎫・ticket-')) {    
                if (message.member.roles.cache.get(ticketsaccess)) {
                    if (!args[1]) {
                        return message.channel.send(client.no + ' | Pourquoi voulez-vous ajouter un utilisateur à ce ticket ?')
                    } else if (!args[0].length === 18 && !isNaN(parseInt(args[0]))) {
                        return message.channel.send(client.no + ' | L\'identifiant entré est invalide.')
                    } else {
                        const member = await client.users.fetch(`${args[0]}`);
                        message.channel.updateOverwrite(member, {
                        'VIEW_CHANNEL': true
                    })
                    const user = await client.users.fetch(`${dbtickets.get(`User_${message.channel.id}`)}`);
                    client.channels.cache.get(ticketslogs).send({
                        embed: {
                            title: `Ajout d'un membre au ticket de ${user.username}#${user.discriminator}`,
                            timestamp: new Date(),
                            fields: [
                                {
                                    name: `:bust_in_silhouette: Utilisateur :`,
                                    value: `\`\`\`${member.username}#${member.discriminator}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: `:newspaper2: Raison :`,
                                    value: `\`\`\`${args.slice(1).join(' ')}\`\`\``,
                                    inline: false                                        
                                },
                                {
                                    name: `:man_police_officer: Modérateur :`,
                                    value: `\`\`\`${message.author.username}#${message.author.discriminator}\`\`\``,
                                    inline: false                                        
                                }
                            ]
                        }
                    })
                    message.channel.send(`J'ai bien ajouté\`${member.username}#${member.discriminator}\` à ce ticket.`)
                    }
                } else if (!message.member.roles.cache.get(ticketsaccess)) {
                    return message.channel.send(client.no + ' | Vous n\'avez pas la permission de faire cela.') 
                }
            } else if (!message.channel.name.startsWith('🎫・ticket-'))  {
                return message.channel.send(client.no + ' | Ce salon n\'est pas un ticket !')
            }
}

exports.help = {
    name: "t-add",
    category: "staff"
}