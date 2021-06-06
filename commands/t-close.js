const Database = require('easy-json-database'),
      { ticketsaccess } = require('../configs/roles.json'),
      { ticketslogs } = require('../configs/channels.json');

const dbtickets = new Database('./database/tickets.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!t-close <raison>```')
    }
    if (!message.member.roles.cache.get(ticketsaccess)) {
        return message.channel.send(client.no + " | Désolé, mais vous n'avez pas la permission d'utiliser cette commande.")
    }
    if (!message.channel.name.startsWith('🎫・ticket-')) {
        return message.channel.send(client.no + ' | Ce salon n\'est pas un ticket.')
    } else {
        const member = await client.users.fetch(`${dbtickets.get(`User_${message.channel.id}`)}`)
        client.channels.cache.get(ticketslogs).send({
                        embed: {
                            title: `Fermeture du ticket de ${member.username}#${member.discriminator}`,
                            timestamp: new Date(),
                            color: client.color,
                            fields: [
                                {
                                    name: `:id: ID :`,
                                    value: `\`\`\`${member.id}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: `:newspaper2: Raison :`,
                                    value: `\`\`\`${args.join(' ')}\`\`\``,
                                    inline: false                                        
                                },
                                {
                                    name: `:man_police_officer: Modérateur :`,
                                    value: `\`\`\`${message.author.username}#${message.author.discriminator}\`\`\``,
                                    inline: false                                        
                                }
                            ]
                        }
            });
            message.channel.delete({ reason: `Fermeture du ticket de ${member.username}#${member.discriminator} par ${message.author.username}#${message.author.discriminator}`});
            setTimeout(() => {
                dbtickets.delete(`User_${ch.id}`);
            }, 1000)
    }
}

exports.help = {
    name: "t-close",
    category: "staff"
}
