import {
    ApplicationCommandOptionType, ButtonInteraction,
    ChatInputCommandInteraction,
    CommandInteraction, GuildMember, Message,
    PermissionsBitField, TextChannel, User, ButtonStyle, ChannelType
} from "discord.js";
import Class from "../..";
import {config, channels, roles} from "../../configs";
import BotModal from "../../modals/BotModal";
import {bots, verificators} from "../../models";
import SendModal from "../../utils/SendModal";
import Slash from "../../utils/Slash";
import {newInfraction} from "../../utils/InfractionService"
import EditDescModal from "../../modals/EditDescModal";

class Bot extends Slash {
    constructor() {
        super({
            guild_id: config.mainguildid,
            name: "bot",
            description: "Gestion des robots.",
            description_localizations: {
                "en-US": "Bot management"
            },
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            options: [
                {
                    type: 2,
                    name: "set",
                    description: "Modifier les informations de votre robot.",
                    description_localizations: {
                        "en-US": "Edit your bot's informations."
                    },
                    options: [
                        {
                            type: 1,
                            name: "site",
                            name_localizations: {
                                "en-US": "website"
                            },
                            description: "Modifier le site web de votre robot",
                            description_localizations: {
                                "en-US": "Edit your bot's website."
                            },
                            options: [
                                {
                                    type: 6,
                                    name: "bot",
                                    description: "Robot dont vous souhaitez modifier le site.",
                                    description_localizations: {
                                        "en-US": "Bot for which you want to edit the website."
                                    },
                                    required: true
                                },
                                {
                                    type: 3,
                                    name: "site",
                                    name_localizations: {
                                        "en-US": "website"
                                    },
                                    description: "Le site web de votre robot (\"none\" pour supprimer).",
                                    description_localizations: {
                                        "en-US": "The website of your bot (\"none\" to delete)."
                                    },
                                    required: true
                                }
                            ]
                        },
                        {
                            type: 1,
                            name: "serveur_support",
                            name_localizations: {
                                "en-US": "support_server"
                            },
                            description: "Modifier l'invitation vers le serveur support de votre robot",
                            description_localizations: {
                                "en-US": "Edit the invite to the support server of your bot."
                            },
                            options: [
                                {
                                    type: 6,
                                    name: "bot",
                                    description: "Robot dont vous souhaitez modifier l'invitation.",
                                    description_localizations: {
                                        "en-US": "Bot for which you want to edit the invite."
                                    },
                                    required: true
                                },
                                {
                                    type: 3,
                                    name: "invitation",
                                    name_localizations: {
                                        "en-US": "invite"
                                    },
                                    description: "L'invitation vers le serveur support de votre robot (\"none\" pour supprimer).",
                                    description_localizations: {
                                        "en-US": "The invite to the support server of your bot (\"none\" to delete)."
                                    },
                                    required: true
                                }
                            ]
                        },
                        {
                            type: 1,
                            name: "préfixe",
                            name_localizations: {
                                "en-US": "prefix"
                            },
                            description: "Modifier le préfixe de votre robot",
                            description_localizations: {
                                "en-US": "Edit the prefix of your bot."
                            },
                            options: [
                                {
                                    type: 6,
                                    name: "bot",
                                    description: "Robot dont vous souhaitez modifier le préfixe.",
                                    description_localizations: {
                                        "en-US": "Bot for which you want to edit the prefix."
                                    },
                                    required: true
                                },
                                {
                                    type: 3,
                                    name: "préfixe",
                                    name_localizations: {
                                        "en-US": "prefix"
                                    },
                                    description: "Le préfixe de votre robot (\"none\" pour supprimer).",
                                    description_localizations: {
                                        "en-US": "The new prefix of your bot (\"none\" to delete)."
                                    },
                                    required: true
                                }
                            ]
                        },
                        {
                            type: 1,
                            name: "description",
                            description: "Modifier la description de votre robot",
                            description_localizations: {
                                "en-US": "Edit the description of your bot."
                            },
                            options: [
                                {
                                    type: 6,
                                    name: "bot",
                                    description: "Robot dont vous souhaitez modifier la description.",
                                    description_localizations: {
                                        "en-US": "Bot for which you want to edit the description."
                                    },
                                    required: true
                                },
                                {
                                    type: 3,
                                    name: "action",
                                    description: "L'action que vous souhaitez effectuer.",
                                    description_localizations: {
                                        "en-US": "The action you want to do."
                                    },
                                    required: true,
                                    choices: [
                                        {
                                            name: "Supprimer la description.",
                                            name_localizations: {
                                                "en-US": "Delete the description."
                                            },
                                            value: "delete"
                                        },
                                        {
                                            name: "Modifier la description.",
                                            name_localizations: {
                                                "en-US": "Edit the description."
                                            },
                                            value: "edit"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 1,
                            name: "slashs",
                            description: "Modifier si votre robot prend en charge les commandes slash.",
                            description_localizations: {
                                "en-US": "Edit if your bot supports slash commands."
                            },
                            options: [
                                {
                                    type: 6,
                                    name: "bot",
                                    description: "Robot dont vous souhaitez modifier la prise en charge des commandes slash.",
                                    description_localizations: {
                                        "en-US": "Bot for which you want to edit the support of slash commands."
                                    },
                                    required: true
                                },
                                {
                                    type: 5,
                                    name: "slashs",
                                    description: "Est-ce que votre robot prend en charge les commandes slash ?",
                                    description_localizations: {
                                        "en-US": "Does your bot support slash commands ?"
                                    },
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 1,
                    name: "add",
                    description: "Ajouter un robot à la liste.",
                    description_localizations: {
                        "en-US": "Add a bot to the list."
                    },
                    options: [
                        {
                            type: 6,
                            name: "bot",
                            description: "Le robot que vous souhaitez ajouter.",
                            description_localizations: {
                                "en-US": "The bot you want to add."
                            },
                            required: true
                        },
                        {
                            type: 3,
                            name: "slashs",
                            description: "Est-ce que votre robot prend en charge les commandes slash ?",
                            description_localizations: {
                                "en-US": "Does your bot support slash commands ?"
                            },
                            required: true,
                            choices: [
                                {
                                    name: "✅ Oui",
                                    name_localizations: {
                                        "en-US": "✅Yes "
                                    },
                                    value: "yes"
                                },
                                {
                                    name: "❌ Non",
                                    name_localizations: {
                                        "en-US": "❌ No"
                                    },
                                    value: "no"
                                }
                            ]
                        },
                        {
                            type: 3,
                            name: "préfixe",
                            name_localizations: {
                                "en-US": "prefix"
                            },
                            description: "Est-ce que votre robot possède un préfixe de commandes (autre que celui pour les commandes slashs) ?",
                            description_localizations: {
                                "en-US": "Does your robot have a command prefix (other than the one for slash commands)?"
                            },
                            required: false,
                            max_length: 4
                        }
                    ]
                },
                {
                    type: 1,
                    name: "reject",
                    description: "Refuser un robot.",
                    description_localizations: {
                        "en-US": "Reject a bot."
                    },
                    options: [
                        {
                            type: 6,
                            name: "bot",
                            description: "Le robot que vous souhaitez refuser.",
                            description_localizations: {
                                "en-US": "The bot you want to reject."
                            },
                            required: true
                        },
                        {
                            type: 3,
                            name: "raison",
                            name_localizations: {
                                "en-US": "reason"
                            },
                            description: "Raison du refus",
                            description_localizations: {
                                "en-US": "Reason for rejection."
                            },
                            required: true,
                            max_length: 200
                        },
                        {
                            type: 3,
                            name: "avertir",
                            name_localizations: {
                                "en-US": "warn"
                            },
                            description: "Avertir l'utilisateur ?",
                            description_localizations: {
                                "en-US": "Warn user?"
                            },
                            required: true,
                            choices: [
                                {
                                    name: "✅ Oui",
                                    name_localizations: {
                                        "en-US": "✅Yes "
                                    },
                                    value: "yes"
                                },
                                {
                                    name: "❌ Non",
                                    name_localizations: {
                                        "en-US": "❌ No"
                                    },
                                    value: "no"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 1,
                    name: "accept",
                    description: "Accepter un robot.",
                    description_localizations: {
                        "en-US": "Accept a bot."
                    },
                    options: [
                        {
                            type: 6,
                            name: "bot",
                            description: "Le robot que vous souhaitez accepter.",
                            description_localizations: {
                                "en-US": "The bot you want to accept."
                            },
                            required: true
                        }
                    ]
                }
            ]
        });
    }

    async run(client: Class, interaction: ChatInputCommandInteraction) {
        const command = interaction.options.getSubcommand()

        switch (command) {
            case "add": {
                const bot = interaction.options.getUser("bot");
                const slashsSupport = interaction.options.getString("slashs");
                const prefix = interaction.options.getString("prefix");

                if (!bot || !bot.bot) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Cet utilisateur n'est pas un bot.**`,
                    ephemeral: true
                });

                const channel = client.channels.cache.get(channels.botslogs) as TextChannel;

                const userBots = await bots.find({ownerId: interaction.user.id});

                const guildMember = interaction.member as GuildMember;

                if ((userBots.length === 2) && !guildMember.roles.cache.has(roles.premium)) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Vous ne pouvez pas ajouter un deuxième bot car vous ne possédez pas le role premium (voir <#${channels.faq}> N°7 pour plus d'informations).**`,
                    ephemeral: true
                });
                if (userBots.length === 2) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Vous ne pouvez pas ajouter plus de deux robots.**`,
                    ephemeral: true
                });

                if (await bots.findOne({botId: bot.id})) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Ce robot est déjà sur la liste.**`,
                    ephemeral: true
                });

                let team: string[] = [];

                const msg = await interaction.reply({
                    content: `**${client.emotes.question} ➜ Êtes-vous le seul propriétaire/développeur de ${bot.username} ?**`,
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
                    ],
                    fetchReply: true
                });

                const filter = (x: any) => x.user.id === interaction.user.id;
                const collector = await msg.createMessageComponentCollector({filter});

                collector.on("collect", async (interaction: ButtonInteraction) => {
                    await interaction.deferUpdate()

                    if (interaction.customId === 'btnYes') {
                        await new bots({
                            botId: bot.id,
                            prefix: prefix || null,
                            ownerId: interaction.user.id,
                            verified: false,
                            team: team,
                            checked: true,
                            avatar: bot.displayAvatarURL(),
                            username: bot.username,
                            receiveBugs: true,
                            bugs: [],
                            bugThread: null,
                            supportSlashs: slashsSupport === "yes" ? true : false
                        }).save();


                        channel.send({
                            content: `<@${interaction.user.id}> / <@&${roles.verificator}>`,
                            embeds: [
                                {
                                    title: "Demande d'ajout...",
                                    description: `<@${interaction.user.id}> a demandé à ajouter le bot [${bot.tag}](https://discord.com/oauth2/authorize?client_id=${bot.id}&permissions=0&scope=bot${slashsSupport === "yes" ? "%20applications.commands" : ""}). Un vérificateur va bientôt s’occuper de lui.`,
                                    color: 0x66DA61,
                                    thumbnail: {
                                        url: bot.displayAvatarURL()
                                    },
                                    timestamp: new Date().toISOString()
                                }
                            ],
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: 3,
                                            custom_id: "AcceptBot",
                                            emoji: {
                                                animated: true,
                                                id: "909015463265173565",
                                                name: "oui2"
                                            }
                                        },
                                        {
                                            type: 2,
                                            style: 2,
                                            custom_id: "RejectBot",
                                            emoji: {
                                                animated: true,
                                                id: "909015461805580298",
                                                name: "non2"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }).then(async (msg) => { await bots.findOneAndUpdate({ botId: bot.id}, {$set: { msgID: msg.id }})})

                        await msg.edit({
                            content: `**${client.emotes.yes} ➜ Votre bot \`${bot.tag}\` vient juste d'être ajouté à la liste d’attente.**`,
                            components: []
                        });

                        collector.stop();
                    }

                    if (interaction.customId === "btnNo") {
                        await msg.edit({
                            content: `**${client.emotes.question} ➜ Veuillez mentionner l’un des autres propriétaire/développeur de ${bot.username}.**`,
                            components: []
                        });

                        const messageFilter = (x: any) => x.author.id === interaction.user.id;
                        const messageCollector = interaction.channel!.createMessageCollector({filter: messageFilter});

                        messageCollector.on("collect", async (m: Message) => {
                            let teammate = m.mentions.users.first();

                            if (m.content !== 'cancel' && !teammate) return msg.reply({
                                content: `**${client.emotes.no} ➜ Utilisateur introuvable.**`
                            }).then(async (mm) => {
                                await m.delete();

                                setTimeout(() => {
                                    return mm.delete();
                                }, 2500);
                            });

                            if (teammate?.bot === true) return msg.reply({
                                content: `**${client.emotes.no} ➜ Merci de mentionner un humain.**`
                            }).then(async (mm) => {
                                await m.delete();

                                setTimeout(() => {
                                    return mm.delete();
                                }, 2500);
                            });

                            if (teammate?.id === interaction.user.id) return msg.reply({
                                content: `**${client.emotes.no} ➜ Merci de ne pas vous mentionner.**`
                            }).then(async (mm) => {
                                await m.delete();

                                setTimeout(() => {
                                    return mm.delete();
                                }, 2500);
                            });

                            if (m.content === 'cancel') {
                                await msg.edit({
                                    content: `**${client.emotes.yes} ➜ Ajout de robot à la liste annulé.**`
                                });

                                await m.delete();

                                collector.stop();
                                return messageCollector.stop();
                            }

                            team.push(teammate!.id);
                            await m.delete()

                            await msg.edit({
                                content: `**${client.emotes.question} ➜ Souhaitez-vous ajouter un autre propriétaire/développeur ?**`,
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            {
                                                type: 2,
                                                style: 3,
                                                label: 'Oui',
                                                custom_id: 'btnNo'
                                            }, {
                                                type: 2,
                                                style: 4,
                                                label: 'Non',
                                                custom_id: 'btnYes'
                                            }
                                        ]
                                    }
                                ]
                            });

                            messageCollector.stop();
                        });
                    }
                });
                break;
            }
            case "reject":{
                // @ts-ignore
                if (!interaction.member.roles.cache.has(roles.verificator)) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cette commande.**`,
                    ephemeral: true
                })

                const bot = interaction.options.getUser("bot") as User
                const reason = interaction.options.getString("raison")
                const warn = interaction.options.getString("avertir")

                let botGet = await bots.findOne({botId: bot.id, verified: false});

                if (!botGet) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Aucune demande n’a été envoyée pour ${bot?.tag} !**`,
                    ephemeral: true
                });

                const channel = client.channels.cache!.get(channels.botslogs);

                channel?.isTextBased() ? channel.send({
                    content: `<@${botGet.ownerId}>`,
                    embeds: [
                        {
                            title: "Refus...",
                            timestamp: new Date().toISOString(),
                            thumbnail: {
                                url: bot?.displayAvatarURL()
                            },
                            color: client.config.color.integer,
                            footer: {
                                text: `Tu peux toujours corriger ce que ${interaction.user.username} demande et refaire une demande ^^`
                            },
                            description: `<@${interaction.user.id}> vient juste de refuser le bot ${bot?.username} pour la raison suivante :\n\`\`\`${reason}\`\`\``
                        }
                    ]
                }) : new Error("The channel is not a Text Based channel");

                const verificator = await verificators.findOne({userId: interaction.user.id})
                if (verificator) {
                    verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
                    verificator.save();
                }
                if (!verificator) await new verificators({
                    userId: interaction.user.id,
                    verifications: 1
                }).save()

                await interaction.reply({
                    content: `**${client.emotes.yes} ➜ Le bot ${bot?.tag} vient bien d'être refusé pour la raison suivante :\n\`\`\`${reason}\`\`\`**`
                })
                if (warn === "yes") await newInfraction(client, bot, interaction.member! as GuildMember, interaction.guild!, "WARN", 'Non respect des conditions d’ajout de bot.', 0)

                await botGet.deleteOne();

                const guildMember = await interaction.guild!.members.fetch(bot.id).catch(() => {
                })

                if (guildMember?.user && config.autokick === true) guildMember?.kick().catch(() => {
                });
                break;
            }
            case "préfixe" :{
                const member = interaction.options.getUser("bot") as User
                const prefix = interaction.options.getString("préfixe") as string

                const db = await bots.findOne({botId: member.id});
                if (!db) return interaction.reply({
                    content: "**" + client.emotes.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même pas un bot).**',
                    ephemeral: true
                });

                // @ts-ignore
                if (db.ownerId !== interaction.user.id && !interaction.member!.roles.cache.get(roles.verificator) && !db.team.includes(interaction.user.id)) return interaction.reply({
                    content: "**" + client.emotes.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**",
                    ephemeral: true
                });

                if (prefix === "none" && !db.supportSlashs) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Vous avez indiqué que votre robot ne supportait pas les commandes slashs. Vous ne pouvez donc pas lui supprimer le préfixe.**`,
                    ephemeral: true
                })

                const channel = client.channels.cache.get(channels.botslogs);

                channel?.isTextBased() ? channel.send({
                        content: `<@${db.ownerId}>${db.team!.length > 0 ? `, ${db.team!.map((x: string) => `<@${x}>`).join(", ")}` : ""}`,
                        embeds: [
                            {
                                color: client.config.color.integer,
                                title: "Modification du profil...",
                                thumbnail: {
                                    url: member.displayAvatarURL()
                                },
                                timestamp: new Date().toISOString(),
                                description: `<@${interaction.user.id}> vient juste d'éditer le prefix de votre robot <@${member.id}> :`,
                                fields: [
                                    {
                                        name: "➜ Avant :",
                                        value: `\`\`\`${db.prefix}\`\`\``,
                                        inline: false
                                    }, {
                                        name: "➜ Après :",
                                        value: `\`\`\`${prefix !== "none" ? prefix : "null"}\`\`\``,
                                        inline: false
                                    }
                                ]
                            }
                        ]
                    })
                    : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

                await interaction.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);

                setTimeout(() => {
                    interaction.guild?.members.cache.get(member.id)?.setNickname(`${prefix !== "none" ? `[${prefix}] ` : ""}${member.username}`).catch(() => {
                    });

                    db.prefix = prefix !== "none" ? prefix : "/";
                    db.save();
                }, 1000)

                break;
            }
            case "description": {
                console.log(1)
                const member = interaction.options.getUser("bot") as User
                const description = interaction.options.getString("action") as string

                const db = await bots.findOne({botId: member.id});
                if (!db) return interaction.reply({
                    content: "**" + client.emotes.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même pas un bot).**',
                    ephemeral: true
                });

                // @ts-ignore
                if (db.ownerId !== interaction.user.id && !interaction.member!.roles.cache.get(roles.verificator) && !db.team.includes(interaction.user.id)) return interaction.reply({
                    content: "**" + client.emotes.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**",
                    ephemeral: true
                });

                if (description === "delete") {
                    if (!db.description) return interaction.reply({
                        content: "**" + client.emotes.no + ' ➜ Tu m\'as demandé supprimer une description qui n\'a jamais été enregistrée ¯\\_(ツ)_/¯**',
                        ephemeral: true
                    });

                    const channel = client.channels.cache.get(channels.botslogs);
                    channel?.isTextBased() ? channel.send({
                            content: `<@${db.ownerId}>${db.team!.length > 0 ? `, ${db.team!.map((x: string) => `<@${x}>`).join(", ")}` : ""}`,
                            embeds: [
                                {
                                    color: client.config.color.integer,
                                    title: "Modification du profil...",
                                    thumbnail: {
                                        url: member.displayAvatarURL()
                                    },
                                    timestamp: new Date().toISOString(),
                                    description: `<@${interaction.user.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`,
                                    fields: [
                                        {
                                            name: "➜ Avant :",
                                            value: `\`\`\`${db.description}\`\`\``,
                                            inline: false
                                        }, {
                                            name: "➜ Après :",
                                            value: `\`\`\`Aucune\`\`\``,
                                            inline: false
                                        }
                                    ]
                                }
                            ]
                        })
                        : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

                    setTimeout(() => {
                        db.description = "";
                        return db.save();
                    }, 1000)

                    return interaction.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
                }

                if (description === "edit") {
                    const modal = new EditDescModal(db.botId)
                    await SendModal(client, interaction, modal)
                    await modal.handleSubmit(client, interaction).catch(() => interaction)
                }
                break;
            }
            case "slashs": {
                const member = interaction.options.getUser("bot") as User;
                const slashs = interaction.options.getBoolean("slashs") as boolean;

                const db = await bots.findOne({botId: member.id});

                if (!db) return interaction.reply({
                    content: "**" + client.emotes.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même pas un bot).**',
                    ephemeral: true
                })
                // @ts-ignore
                if (db.ownerId !== interaction.user.id && !interaction.member!.roles.cache.get(roles.verificator) && !db.team.includes(interaction.user.id)) return interaction.reply({
                    content: "**" + client.emotes.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**",
                    ephemeral: true
                })

                if (slashs === db.supportSlashs) return interaction.reply({
                    content: "**" + client.emotes.no + ' ➜ Tu m\'as demandé de modifier la prise en charge des commandes slashs de ton robot, mais tu n\'as pas changé la valeur actuelle...**',
                    ephemeral: true
                })

                const channel = client.channels.cache.get(channels.botslogs) as TextChannel;

                channel?.isTextBased() ? await channel.send({
                        content: `<@${db.ownerId}>${db.team!.length > 0 ? `, ${db.team!.map((x: string) => `<@${x}>`).join(", ")}` : ""}`,
                        embeds: [
                            {
                                color: client.config.color.integer,
                                title: "Modification du profil...",
                                thumbnail: {
                                    url: member.displayAvatarURL()
                                },
                                timestamp: new Date().toISOString(),
                                description: `<@${interaction.user.id}> vient juste d'éditer la prise en charge des commandes slashs de votre robot <@${member.id}> :`,
                                fields: [
                                    {
                                        name: "➜ Avant :",
                                        value: `\`\`\`${db!.supportSlashs ? "Oui" : "Non"}\`\`\``,
                                        inline: false
                                    }, {
                                        name: "➜ Après :",
                                        value: `\`\`\`${slashs ? "Oui" : "Non"}\`\`\``,
                                        inline: false
                                    }
                                ]
                            }
                        ]
                    })
                    : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

                setTimeout(() => {
                    db!.supportSlashs = slashs;
                    db!.save();
                }, 1000)

                await interaction.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
                break
            }
            case "accept": {
                const bot = interaction.options.getUser("bot") as User;

                const member = interaction.guild?.members.fetch(bot.id).catch(() => null) as Promise<GuildMember | null>;

                if (!bot.bot || !member) return interaction.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas mentionné de bots, ou alors, il n'est pas présent sur le serveur.**` });

                const channel = client.channels.cache.get(channels.botslogs) as TextChannel

                let getBot = await bots.findOne({ botId: bot.id });

                if (!getBot) return interaction.reply({ content: `**${client.emotes.no} ➜ ${bot.tag} n'est pas sur la liste.**` });
                if (getBot.verified === true) return interaction.reply({ content: `**${client.emotes.no} ➜ ${bot.tag} est déjà vérifié.**` });

                getBot.verified = true;
                getBot.save();

                getBot = await bots.findOne({ botId: bot.id });

                await channel.send({
                    content: `<@${getBot!.ownerId}>`,
                    embeds: [
                        {
                            title: "Acceptation...",
                            timestamp: new Date().toISOString(),
                            thumbnail: {
                                url: bot.displayAvatarURL()
                            },
                            color: 0x00FF2A,
                            footer: {
                                text: `Pense à laisser un avis au serveur via la commande ${client.config.prefix}avis ^^`
                            },
                            description: `<@${interaction.user.id}> vient juste d'accepter le bot ${bot.username} !`
                        }
                    ]
                });

                await interaction.reply({content: `**${client.emotes.yes} ➜ Le bot ${bot.tag} vient bien d'être accepté !**`});

                const owner = interaction.guild?.members.cache.get(`${getBot!.ownerId}`);

                if (!owner) return;

                owner.user.send({
                    embeds : [
                        {
                            title: "Acceptation...",
                            timestamp: new Date().toISOString(),
                            thumbnail: {
                                url: bot.displayAvatarURL()
                            },
                            color: 0x00FF2A,
                            footer: {
                                text: `Pense à laisser un avis au serveur via la commande ${client.config.prefix}avis ^^`
                            },
                            description: `Votre bot \`${bot.tag}\` vient juste d'être accepté par nos vérificateurs.\nN'oublie pas nous laisser un avis via la commande \`${client.config.prefix}avis\` !`
                        }
                    ]
                }).catch(() => {})

                // @ts-ignore
                member.roles.remove(roles.botintests).catch(() => {});
                // @ts-ignore
                member.roles.add(roles.listedbot).catch(() => {});
                await owner.roles.add(roles.isclient);

                getBot?.team!.forEach((teammate: string) => client.guilds.cache.get(client.config.mainguildid)?.members.cache.get(teammate)?.roles.add(roles.isclient).catch(() => {}));

                const verificator = await verificators.findOne({ userId: bot.id })
                if (verificator) {
                    verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
                    verificator.save();
                }
                if (!verificator) await new verificators({
                    userId: bot.id,
                    verifications: 1
                }).save()
                break
            }
            case "serveur_support": {
                interaction.reply({ content: `**${client.emotes.no} ➜ Cette commande est en cours de développement.**\n\n> 💡 Tip : Vous pouvez modifier les informations de votre robot en vous connectant sur le site et en accédant à sa page : https://yopbotlist.me`, ephemeral: true });
                break
            }
            case "site": {
                interaction.reply({ content: `**${client.emotes.no} ➜ Cette commande est en cours de développement.**\n\n> 💡 Tip : Vous pouvez modifier les informations de votre robot en vous connectant sur le site et en accédant à sa page : https://yopbotlist.me`, ephemeral: true });
                break
            }
        }
    }
}

export = new Bot;