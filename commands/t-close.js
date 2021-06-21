const { ticketsaccess } = require('../configs/roles.json'),
      { ticketslogs } = require('../configs/channels.json'),
      Database = require("easy-json-database")

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!t-close <raison>```')
    }
    if (!message.member.roles.cache.get(ticketsaccess)) {
        return message.channel.send(client.no + " | DÃ©solÃ©, mais vous n'avez pas la permission d'utiliser cette commande.")
    }
    if (!message.channel.name.startsWith('ðŸŽ«ãƒ»ticket-')) return message.channel.send(client.no + ' | Ce salon n\'est pas un ticket.')
        const member = await client.users.fetch(`${client.dbTickets.get(`User_${message.channel.id}`)}`);
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
                                    name: `:man_police_officer: ModÃ©rateur :`,
                                    value: `\`\`\`${message.author.username}#${message.author.discriminator}\`\`\``,
                                    inline: false                                        
                                }
                            ]
                        }
            });
            setTimeout(() => {
                client.dbTickets.delete(`User_${message.channel.id}`);
                message.channel.send(client.yes + " | Fermeture en cours de ce ticket...")
                setTimeout(() => {
                    message.channel.delete({ reason: `Fermeture du ticket de ${member.username}#${member.discriminator} par ${message.author.username}#${message.author.discriminator}`});
                }, 1000)
            }, 1000)
}

exports.help = {
    name: "t-close",
    category: "staff"
}
