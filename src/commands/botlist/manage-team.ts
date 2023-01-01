import Command from '../../utils/Command';
import { Message, MessageComponentInteraction } from 'discord.js';
import Class from '../..';
import { channels, roles } from '../../configs';
import { bots } from '../../models';

class TeamManager extends Command {
    constructor() {
        super({
            name: 'manage-team',
            category: 'Botlist',
            description: 'Gérer la team d\'un bot.',
            usage: 'manage-team <bot>',
            aliases: ['team'],
            cooldown: 20,
            minArgs: 1
        })
    }

    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        const member = message.mentions.members!.first() || await message.guild!.members.fetch(args[0]).catch(() => { });

        if (!member?.user) return message.reply({
            content: `**${client.emotes.no} ➜ Membre introuvable.**`
        });

        if (!member.user.bot) return message.reply({
            content: `**${client.emotes.no} ➜ Ce membre n’est pas un robot.**`
        });

        const oldData = await bots.findOne({ botId: member.user.id, verified: true });

        if (!oldData) return message.reply({
            content: `**${client.emotes.no} ➜ Ce robot n’est pas listé.**`
        });

        if (!message.member!.roles.cache.has(roles.verificator) && (message.author.id !== oldData.ownerId)) return message.reply({
            content: `**${client.emotes.no} ➜ Vous ne pouvez pas gérer la team de ce robot.**`
        });

        let msg = await message.reply({
            embeds: [
                {
                    title: 'Gestion de la team',
                    color: client.config.color.integer,
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'YopBot V' + client.version
                    },
                    description: `Veuillez sélectionner l’une des options ci-dessous. ${oldData.team!.length > 0 ? `La liste actuelle des membres de votre team est la suivante :\n${oldData.team!.map(x => `> - <@${x}>${client.users.cache.get(x) ? " - " + client.users.cache.get(x)?.tag : ""}`).join('\n')}` : "Aucun autre membre dans la team"}`
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "menuTeamManager",
                            options: [
                                {
                                    label: "Transférer",
                                    value: "transfer",
                                    description: "Transférer la propriété de " + member.user.username,
                                    emoji: {
                                        name: "🔄"
                                    }
                                }, {
                                    label: "Ajouter",
                                    value: "add",
                                    description: "Ajouter un utilisateur à la team",
                                    emoji: {
                                        name: "🆕"
                                    }
                                }, {
                                    label: "Retirer",
                                    value: "delete",
                                    description: "Retirer un utilisateur de la team.",
                                    emoji: {
                                        name: "⛔"
                                    }
                                }
                            ],
                            placeholder: "Veuillez sélectionner une action"
                        }
                    ]
                }
            ]
        });

        let memberToTransfer: string;

        const filter = (x: any) => x.user.id === message.author.id
        const collector = await msg.createMessageComponentCollector({ filter, time: 300000 });

        // @ts-ignore
        collector.on("collect", async (interaction: MessageComponentInteraction) => {
            await interaction.deferUpdate();
            const data = await bots.findOne({ botId: member.user.id });

            if (interaction.isStringSelectMenu()) {
                if (interaction.values[0] === "transfer") {
                    if (data!.team!.length < 1) message.reply({
                        content: `**${client.emotes.no} ➜ Vous n'avez aucun membre dans votre team à qui transmettre la propriété.**`
                    }).then(m => setTimeout(() => { return m.delete() }, 3000));

                    else {
                        msg.edit({
                            embeds: [
                                {
                                    title: "Transfert de propriété",
                                    color: client.config.color.integer,
                                    thumbnail: {
                                        url: member.user.displayAvatarURL()
                                    },
                                    timestamp: new Date().toISOString(),
                                    footer: {
                                        text: "YopBot V" + client.version
                                    },
                                    description: `Veuillez mentionner/entrer l’identifiant du membre à qui vous souhaitez transférer la propriété de votre robot.`
                                }
                            ],
                            components: []
                        });

                        const msgFilter = (x: any) => x.author.id === message.author.id;
                        const msgCollector = msg.channel.createMessageCollector({ filter: msgFilter });

                        msgCollector.on("collect", async (m: Message) => {
                            if (m.content === "cancel") {
                                m.delete();
                                msg.delete();
                                collector.stop();
                                return msgCollector.stop();
                            }

                            const user = m.mentions.members?.first() || await message.guild?.members.fetch(m.content);

                            if (!user || !data!.team!.includes(user.user.id)) message.reply({
                                content: `**${client.emotes.no} ➜ Vous ne pouvez transférer la propriété uniquement à un membre présent le serveur ET dans votre team.**`
                            }).then((mm) => setTimeout(() => { return mm.delete() }, 3000));

                            memberToTransfer = user!.user.id

                            msg.edit({
                                embeds: [
                                    {
                                        title: "Transfert de la propriété",
                                        color: client.config.color.integer,
                                        thumbnail: {
                                            url: member.user.displayAvatarURL()
                                        },
                                        timestamp: new Date().toISOString(),
                                        footer: {
                                            text: 'YopBot V' + client.version
                                        },
                                        description: `**ATTENTION ! Le transfert de propriété est irréversible. Le STAFF de YopBotList décline toute responsabilité si vous revenez sur votre décision. Êtes-vous donc certain(e) de ce que vous faites ?**`
                                    }
                                ],
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            {
                                                type: 2,
                                                style: 3,
                                                label: 'Oui',
                                                custom_id: 'btnYes'
                                            }, {
                                                type: 2,
                                                style: 4,
                                                label: 'Non',
                                                custom_id: 'btnNo'
                                            }
                                        ]
                                    }
                                ]
                            });

                            m.delete();

                            return msgCollector.stop();
                        });
                    }
                }

                if (interaction.values[0] === "add") {
                    if (data!.team!.length > 4) return msg.edit(`**${client.emotes.no} ➜ Une team ne peut pas dépasser les 5 membres.**`)

                    msg.edit({
                        embeds: [
                            {
                                title: "Ajout d'utilisateur",
                                color: client.config.color.integer,
                                thumbnail: {
                                    url: member.user.displayAvatarURL()
                                },
                                timestamp: new Date().toISOString(),
                                footer: {
                                    text: 'YopBot V' + client.version
                                },
                                description: `Veuillez mentionner/entrer l’identifiant du membre que vous souhaitez ajouter à votre team.`
                            }
                        ],
                        components: []
                    });

                    const msgFilter2 = (x: any) => x.author.id === message.author.id;
                    const msgCollector2 = msg.channel.createMessageCollector({ filter: msgFilter2 });

                    msgCollector2.on("collect", async (m: Message) => {
                        if (m.content === "cancel") {
                            m.delete();
                            msg.delete();
                            collector.stop();
                            return msgCollector2.stop();
                        }

                        const user = m.mentions.members!.first() || await message.guild!.members.fetch(m.content).catch(() => { });

                        if (!user || data!.team!.includes(user.user.id)) message.channel.send({
                            content: `**${client.emotes.no} ➜ Membre introuvable ou déjà présent dans votre team.**`
                        }).then((mm) => setTimeout(() => { return mm.delete() }, 3000));

                        data?.team!.push(user!.user.id);
                        data?.save();

                        msg.edit({
                            embeds: [
                                {
                                    title: 'Gestion de la team',
                                    color: client.config.color.integer,
                                    thumbnail: {
                                        url: member.user.displayAvatarURL()
                                    },
                                    timestamp: new Date().toISOString(),
                                    footer: {
                                        text: 'YopBot V' + client.version
                                    },
                                    description: `Veuillez sélectionner l’une des options ci-dessous. ${data!.team!.length > 0 ? `La liste actuelle des membres de votre team est la suivante :\n${data!.team!.map(x => `> - <@${x}>${client.users.cache.get(x) ? " - " + client.users.cache.get(x)?.tag : ""}`).join('\n')}` : "Aucun autre membre dans la team"}`
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 3,
                                            custom_id: "menuTeamManager",
                                            options: [
                                                {
                                                    label: "Transférer",
                                                    value: "transfer",
                                                    description: "Transférer la propriété de " + member.user.username,
                                                    emoji: {
                                                        name: "🔄"
                                                    }
                                                }, {
                                                    label: "Ajouter",
                                                    value: "add",
                                                    description: "Ajouter un utilisateur à la team",
                                                    emoji: {
                                                        name: "🆕"
                                                    }
                                                }, {
                                                    label: "Retirer",
                                                    value: "delete",
                                                    description: "Retirer un utilisateur de la team.",
                                                    emoji: {
                                                        name: "⛔"
                                                    }
                                                }
                                            ],
                                            placeholder: "Veuillez sélectionner une action"
                                        }
                                    ]
                                }
                            ]
                        });

                        m.delete();
                        return msgCollector2.stop();
                    });
                }

                if (interaction.values[0] === "delete") {
                    msg.edit({
                        embeds: [
                            {
                                title: 'Retrait d’utilisateur',
                                color: client.config.color.integer,
                                thumbnail: {
                                    url: member.user.displayAvatarURL()
                                },
                                timestamp: new Date().toISOString(),
                                footer: {
                                    text: 'YopBot V' + client.version
                                },
                                description: `Veuillez mentionner/entrer l’identifiant du membre que vous souhaitez retirer de votre team.`
                            }
                        ],
                        components: []
                    });

                    const msgFilter3 = (x: any) => x.author.id === message.author.id;
                    const msgCollector3 = msg.channel.createMessageCollector({ filter: msgFilter3 });

                    msgCollector3.on("collect", async (m: Message) => {
                        if (m.content === "cancel") {
                            m.delete();
                            msg.delete();
                            collector.stop();
                            return msgCollector3.stop();
                        }

                        const user = m.mentions.members!.first() || await message.guild!.members.fetch(m.content).catch(() => { });

                        if (!user || data!.team!.includes(user.user.id)) message.channel.send({
                            content: `**${client.emotes.no} ➜ Membre introuvable ou déjà présent dans votre team.**`
                        }).then((mm) => setTimeout(() => { return mm.delete() }, 3000));

                        const newArray = data!.team!.filter((x: string) => x !== user!.user.id);
                        data!.team = newArray;
                        data?.save();

                        msg.edit({
                            embeds: [
                                {
                                    title: 'Gestion de la team',
                                    color: client.config.color.integer,
                                    thumbnail: {
                                        url: member.user.displayAvatarURL()
                                    },
                                    timestamp: new Date().toISOString(),
                                    footer: {
                                        text: 'YopBot V' + client.version
                                    },
                                    description: `Veuillez sélectionner l’une des options ci-dessous. ${data!.team.length > 0 ? `La liste actuelle des membres de votre team est la suivante :\n${data!.team.map(x => `> - <@${x}>${client.users.cache.get(x) ? " - " + client.users.cache.get(x)?.tag : ""}`).join('\n')}` : "Aucun autre membre dans la team"}`
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 3,
                                            custom_id: "menuTeamManager",
                                            options: [
                                                {
                                                    label: "Transférer",
                                                    value: "transfer",
                                                    description: "Transférer la propriété de " + member.user.username,
                                                    emoji: {
                                                        name: "🔄"
                                                    }
                                                }, {
                                                    label: "Ajouter",
                                                    value: "add",
                                                    description: "Ajouter un utilisateur à la team",
                                                    emoji: {
                                                        name: "🆕"
                                                    }
                                                }, {
                                                    label: "Retirer",
                                                    value: "delete",
                                                    description: "Retirer un utilisateur de la team.",
                                                    emoji: {
                                                        name: "⛔"
                                                    }
                                                }
                                            ],
                                            placeholder: "Veuillez sélectionner une action"
                                        }
                                    ]
                                }
                            ]
                        });

                        m.delete();
                        return msgCollector3.stop();
                    });
                }
            }

            if (interaction.isButton()) {
                if (interaction.customId === "btnNo") msg.edit({
                    embeds: [
                        {
                            title: 'Gestion de la team',
                            color: client.config.color.integer,
                            thumbnail: {
                                url: member.user.displayAvatarURL()
                            },
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: 'YopBot V' + client.version
                            },
                            description: `Veuillez sélectionner l’une des options ci-dessous. ${data!.team!.length > 0 ? `La liste actuelle des membres de votre team est la suivante :\n${data!.team!.map(x => `> - <@${x}>${client.users.cache.get(x) ? " - " + client.users.cache.get(x)?.tag : ""}`).join('\n')}` : "Aucun autre membre dans la team"}`
                        }
                    ],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 3,
                                    custom_id: "menuTeamManager",
                                    options: [
                                        {
                                            label: "Transférer",
                                            value: "transfer",
                                            description: "Transférer la propriété de " + member.user.username,
                                            emoji: {
                                                name: "🔄"
                                            }
                                        }, {
                                            label: "Ajouter",
                                            value: "add",
                                            description: "Ajouter un utilisateur à la team",
                                            emoji: {
                                                name: "🆕"
                                            }
                                        }, {
                                            label: "Retirer",
                                            value: "delete",
                                            description: "Retirer un utilisateur de la team.",
                                            emoji: {
                                                name: "⛔"
                                            }
                                        }
                                    ],
                                    placeholder: "Veuillez sélectionner une action"
                                }
                            ]
                        }
                    ]
                });

                if (interaction.customId === "btnYes") {
                    data!.ownerId = memberToTransfer;
                    const newArray = data!.team!.filter(teammate => teammate !== memberToTransfer);
                    newArray.push(message.author.id);
                    data!.team = newArray;
                    data!.save();

                    const channel = client.channels.cache.get(channels.botslogs);

                    channel?.isTextBased() ? channel.send({
                        content: `<@&${roles.verificator}>`,
                        embeds: [
                            {
                                title: 'Transfert de propriété',
                                color: client.config.color.integer,
                                thumbnail: {
                                    url: member.user.displayAvatarURL()
                                },
                                timestamp: new Date().toISOString(),
                                footer: {
                                    text: 'YopBot V' + client.version
                                },
                                description: `La propriété de ${member.user.tag} a été transférée à <@${memberToTransfer}>`
                            }
                        ]
                    }) : new Error(`Channel botslogs: ${channels.botslogs} n'est pas en channel de texte`);

                    msg.edit({
                        content: `**${client.emotes.yes} ➜ La propriété a bien été transférée !**`,
                        components: [],
                        embeds: []
                    });

                    return collector.stop();
                }
            }
        });
    }
}

export = new TeamManager;
