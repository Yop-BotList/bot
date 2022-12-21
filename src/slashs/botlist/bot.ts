import { ApplicationCommandOptionType, CommandInteraction, PermissionsBitField } from "discord.js";
import Class from "../..";
import { config, channels, roles } from "../../configs";
import BotModal from "../../modals/BotModal";
import { bots, verificators } from "../../models";
import SendModal from "../../utils/SendModal";
import Slash from "../../utils/Slash";
import { newInfraction } from "../../utils/InfractionService"

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
                                    description: "Le préfixe de votre robot.",
                                    description_localizations: {
                                        "en-US": "The new prefix of your bot."
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
            ]
        });
    }
    
    async run(client: Class, interaction: CommandInteraction) {
        const command = interaction.options.getSubcommand()

        switch (command) {
            case "add": {
                const bot = interaction.options.getUser("bot");
                const slashsSupport = interaction.options.getString("slashs");
                const prefix = interaction.options.getString("prefix");

                if (!bot.bot) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Cet utilisateur n'est pas un bot.**`,
                    ephemeral: true
                });

                const channel = client.channels.cache.get(channels.botslogs) as TextChannel;

                const userBots = await bots.find({ ownerId: interaction.user.id });

                const guildMember = interaction.member as GuildMember;

                if ((userBots.length === 2) && !guildMember.roles.cache.has(roles.premium)) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Vous ne pouvez pas ajouter un deuxième bot car vous ne possédez pas le role premium (voir <#${channels.faq}> N°7 pour plus d'informations).**`,
                    ephemeral: true
                });
                if (userBots.length === 2) return interaction.reply({
                    content: `**${client.emotes.no} ➜ Vous ne pouvez pas ajouter plus de deux robots.**`,
                    ephemeral: true
                });

                if (await bots.findOne({ botId: bot.id })) return interaction.reply({
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
                const collector = await msg.createMessageComponentCollector({ filter });

                collector.on("collect", async (interaction: ButtonInteraction) => {
                    await interaction.deferUpdate()

                    if (interaction.customId === 'btnYes') {
                        new bots({
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
                            ]
                        });

                        msg.edit({
                            content: `**${client.emotes.yes} ➜ Votre bot \`${bot.tag}\` vient juste d'être ajouté à la liste d’attente.**`,
                            components: []
                        });

                        collector.stop();
                    }

                    if (interaction.customId === "btnNo") {
                        msg.edit({
                            content: `**${client.emotes.question} ➜ Veuillez mentionner l’un des autres propriétaire/développeur de ${bot.username}.**`,
                            components: []
                        });

                        const messageFilter = (x: any) => x.author.id === interaction.user.id;
                        const messageCollector = interaction.channel!.createMessageCollector({ filter: messageFilter });

                        messageCollector.on("collect", async (m: Message) => {
                            let teammate = m.mentions.users.first();

                            if (m.content !== 'cancel' && !teammate) return msg.reply({
                                content: `**${client.emotes.no} ➜ Utilisateur introuvable.**`
                            }).then(async (mm) => {
                                m.delete();

                                setTimeout(() => {
                                    return mm.delete();
                                }, 2500);
                            });

                            if (teammate?.bot === true) return msg.reply({
                                content: `**${client.emotes.no} ➜ Merci de mentionner un humain.**`
                            }).then(async (mm) => {
                                m.delete();

                                setTimeout(() => {
                                    return mm.delete();
                                }, 2500);
                            });

                            if (teammate?.id === interaction.user.id) return msg.reply({
                                content: `**${client.emotes.no} ➜ Merci de ne pas vous mentionner.**`
                            }).then(async (mm) => {
                                m.delete();

                                setTimeout(() => {
                                    return mm.delete();
                                }, 2500);
                            });

                            if (m.content === 'cancel') {
                                msg.edit({
                                    content: `**${client.emotes.yes} ➜ Ajout de robot à la liste annulé.**`
                                });

                                m.delete();

                                collector.stop();
                                return messageCollector.stop();
                            }

                            team.push(teammate!.id);
                            m.delete()

                            msg.edit({
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
            case "reject": {
                const bot = interaction.options.getUser("bot")
                const reason = interaction.options.getString("raison")
                const warn = interaction.options.getString("avertir")

                let botGet = await bots.findOne({ botId: bot.id, verified: false });

                if (!botGet) return interaction.reply({ content: `**${client.emotes.no} ➜ Aucune demande n’a été envoyée pour ${bot?.tag} !**`, ephemeral: true });

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

                const verificator = await verificators.findOne({ userId: interaction.user.id })
                if (verificator) {
                    verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
                    verificator.save();
                }
                if (!verificator) new verificators({
                    userId: interaction.user.id,
                    verifications: 1
                }).save()

                interaction.reply({
                    content: `**${client.emotes.yes} ➜ Le bot ${bot?.tag} vient bien d'être refusé pour la raison suivante :\n\`\`\`${reason}\`\`\`**`
                })
                if (warn === "yes") await newInfraction(client, bot, interaction.member!, interaction.guild!, "WARN", 'Non respect des conditions d’ajout de bot.', 0)

                await botGet.deleteOne();

                const guildMember = await interaction.guild!.members.fetch(bot.id).catch(() => { })

                if (guildMember?.user && config.autokick === true) guildMember?.kick().catch(() => { });
                break;
            }
        }
    }
}

export = new Bot;