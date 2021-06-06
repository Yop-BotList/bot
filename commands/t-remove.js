const Database = require('easy-json-database'),
      { ticketsaccess } = require('../configs/roles.json'),
      { ticketslogs } = require('../configs/channels.json');

const dbtickets = new Database('./database/tickets.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!t-remove <id> <raison>```')
    } else if (message.channel.name.startsWith('🎫・ticket-')) {    
                if (message.member.roles.cache.get(ticketsaccess)) {
                    if (!args[1]) {
                        return message.channel.send(client.no + ' | Pourquoi voulez-vous retirer un utilisateur à ce ticket ?')
                    } else if (!args[0].length === 18 && !isNaN(parseInt(args[0]))) {
                        return message.channel.send(client.no + ' | L\'identifiant entré est invalide.')
                    } else {
                        const member = await client.users.fetch(`${args[0]}`);
                        message.channel.updateOverwrite(member, {
                        'VIEW_CHANNEL': false
                    })
                    const user = await client.users.fetch(`${dbtickets.get(`User_${message.channel.id}`)}`);
                    client.channels.cache.get(ticketslogs).send({
                        embed: {
                            title: `Retrait d'un membre au ticket de ${user.username}#${user.discriminator}`,
                            timestamp: new Date(),
                            color: client.color,
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
                    message.channel.send(client.yes + ` | J'ai bien retiré \`${member.username}#${member.discriminator}\` de ce ticket.`)
                    }
                } else if (!message.member.roles.cache.get('783669284207198218')) {
                    return message.channel.send(client.no + ' | Vous n\'avez pas la permission de faire cela.') 
                }
            } else if (!message.channel.name.startsWith('🎫・ticket-'))  {
                return message.channel.send(client.no + ' | Ce salon n\'est pas un ticket !')
            }
}

exports.help = {
    name: "t-remove",
    category: "staff"
}
