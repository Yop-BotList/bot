const Database = require('easy-json-database'),
      { ticketsaccess } = require('../configs/roles.json'),
      { ticketslogs, ticketcategory } = require('../configs/channels.json');

const dbtickets = new Database('./database/tickets.json');

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!t-create <raison>```')
    } else {
                let guild = message.guild;
                let categorie = await message.guild.channels.cache.find(c => c.id === ticketcategory && c.type === "category");

                guild.channels.create(`🎫・ticket-${message.author.username}`, {
                    type: 'text',
                    parent: categorie.id,
                    permissionOverwrites: [
                        {
                            allow: 'VIEW_CHANNEL',
                            id: message.author.id
                        },
                        {
                            deny: 'VIEW_CHANNEL',
                            id: guild.id
                        },
                        {
                            allow: 'VIEW_CHANNEL',
                            id: ticketsaccess
                        }
                    ]
                }).then(ch => {
                    ch.send("@here", {
                        embed: {
                            title: `Nouveau ticket de ${message.author.username}#${message.author.discriminator}`,
                            timestamp: new Date(),
                            color: client.color,
                            footer: {
                                text: 'Un membre du STAFF va bientôt arriver. Veuillez exposer votre demande maintenant.'
                            },
                            fields: [
                                {
                                    name: `:id: ID :`,
                                    value: `\`\`\`${message.author.id}\`\`\``,
                                    inline: false                                        
                                },
                                {
                                    name: `:newspaper2: Raison :`,
                                    value: `\`\`\`${args.join(' ')}\`\`\``,
                                    inline: false                                        
                                },
                            ]
                        }
                    })

                    message.channel.send(client.yes + ' | Votre ticket a bien été créé. Jetez un coup d\'œil au salon dans lequel je viens de vous mentionner :wink: !');
                    client.channels.cache.get(ticketslogs).send({
                        embed: {
                            title: `Nouveau ticket de ${message.author.username}#${message.author.discriminator}`,
                            timestamp: new Date(),
                            color: client.color,
                            fields: [
                                {
                                    name: `:id: ID :`,
                                    value: `\`\`\`${message.author.id}\`\`\``,
                                    inline: false                                        
                                },
                                {
                                    name: `:newspaper2: Raison :`,
                                    value: `\`\`\`${args.join(' ')}\`\`\``,
                                    inline: false                                        
                                },
                            ]
                        }
                    });
                    client.dbTickets.set(`User_${ch.id}`, `${message.author.id}`);
                })
}
}

exports.help = {
    name: "t-create",
    category: "utils",
    aliases: ["ticket-create", "t-new", "ticket-new"],
    description: "Ouvrir un ticket.",
    usage: "t-create <raison>",
    example: ["t-create Bug sur le bot", "ticket-new Pub MP !"]
}