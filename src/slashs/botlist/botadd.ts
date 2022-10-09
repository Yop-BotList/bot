import { ApplicationCommandOptionType, ButtonInteraction, CommandInteraction, GuildMember, Message, PermissionsBitField, TextChannel } from "discord.js";
import Class from "../..";
import { channels, config, roles } from "../../configs";
import { bots } from "../../models";
import Slash from "../../utils/Slash";

class BotAdd extends Slash {
    constructor() {
        super({
            name: "botadd",
            description: "Ajoute un bot à la liste.",
            description_localizations: {
                "en-US": "Add a bot to the list"
            },
            dm_permission: false,
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            options: [
                {
                    name: "bot-id",
                    type: ApplicationCommandOptionType.String,
                    description: "L'id du bot",
                    descriptionLocalizations: {
                        "en-US": "Bot ID to add"
                    },
                    min_length: 18,
                    required: true
                }, {
                    name: "prefix",
                    type: ApplicationCommandOptionType.String,
                    description: "Le prefix du bot",
                    descriptionLocalizations: {
                        "en-US": "Bot prefix"
                    },
                    required: true
                }
            ],
            guild_id: config.mainguildid
        });
    }

    async run(client: Class, interaction: CommandInteraction) {
        const botId = interaction.options.get("bot-id");
        const botPrefix = interaction.options.get("prefix");

        const user = await client.users.fetch(`${botId!.value}`).catch(() => {});

        if (!user) return interaction.reply({
            content: `**${client.emotes.no} ➜ Je ne trouve pas l'utilisateur.**`,
            ephemeral: true
        });
        if (!user.bot) return interaction.reply({
            content: `**${client.emotes.no} ➜ Cet utilisateur n'est pas un bot.**`,
            ephemeral: true
        });

        const channel = client.channels.cache.get(channels.botslogs) as TextChannel;

        const userBots = await bots.find({ ownerId: interaction.user.id });

        const guildMember = interaction.member as GuildMember;

        if ((userBots.length > 0) && !guildMember.roles.cache.has(roles.premium)) return interaction.reply({
            content: `**${client.emotes.no} ➜ Vous ne pouvez pas ajouter un deuxième bot car vous ne possédez pas le role premium (voir <#${channels.faq}> N°7 pour plus d'informations).**`,
            ephemeral: true
        });

        if (await bots.findOne({ botId: user.id })) return interaction.reply({
            content: `**${client.emotes.no} ➜ Ce bot est déjà dans la liste.**`,
            ephemeral: true
        });

        let team: string[] = [];

        const msg = await interaction.reply({
            content: `**${client.emotes.question} ➜ Êtes-vous le seul propriétaire/développeur de ${user.username} ?**`,
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
                    botId: user.id,
                    prefix: botPrefix!.value,
                    ownerId: interaction.user.id,
                    verified: false,
                    team: team,
                    checked: true
                }).save();

                channel.send({
                    content: `<@${interaction.user.id}> / <@&${roles.verificator}>`,
                    embeds: [
                        {
                            title: "Demande d'ajout...",
                            description: `<@${interaction.user.id}> a demandé à ajouter le bot [${user.username}#${user.discriminator}](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=0&scope=bot%20applications.commands). Un vérificateur va bientôt s’occuper de lui.`,
                            color: 0x66DA61,
                            thumbnail: {
                                url: user.displayAvatarURL()
                            },
                            timestamp: new Date().toISOString()
                        }
                    ]
                });

                msg.edit({
                    content: `**${client.emotes.yes} ➜ Votre bot \`${user.tag}\` vient juste d'être ajouté à la liste d’attente.**`,
                    components: []
                });

                collector.stop();
            }

            if (interaction.customId === "btnNo") {
                msg.edit({
                    content: `**${client.emotes.question} ➜ Veuillez mentionner l’un des autres propriétaire/développeur de ${user.username}.**`,
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
    }
}

export = new BotAdd;