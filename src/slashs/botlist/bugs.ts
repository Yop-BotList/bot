import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction, GuildMemberRoleManager, Message,
    PermissionsBitField, TextChannel, ThreadChannel
} from "discord.js";
import Class from "../..";
import { channels, config, roles } from "../../configs";
import Slash from "../../utils/Slash";
import { bots } from "../../models"

class Bugs extends Slash {
    constructor() {
        super({
            name: "bugs",
            description: "Système de bugs.",
            description_localizations: {
                "en-GB": "Bugs system"
            },
            dm_permission: false,
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            options: [
                {
                    name: "toggle",
                    type: ApplicationCommandOptionType.Subcommand,
                    description: "Autoriser ou pas les membres de YopBotList à vous faire remonter des bugs sur votre robot.",
                    descriptionLocalizations: {
                        "en-GB": "Allow or not YopBotList members to report bugs on your robot."
                    },
                    options: [
                        {
                            type: ApplicationCommandOptionType.User,
                            description: "Robot sur lequel vous avez trouvé un bug.",
                            required: true,
                            name: "bot",
                        }
                    ]
                },
                {
                    name: "submit",
                    type: ApplicationCommandOptionType.Subcommand,
                    description: "Signaler un bug sur un robot à son développeur.",
                    descriptionLocalizations: {
                        "en-GB": "Report a bug on a robot to the developer."
                    },
                    options: [
                        {
                            type: ApplicationCommandOptionType.User,
                            description: "Robot sur lequel vous avez trouvé un bug.",
                            required: true,
                            name: "bot",
                        },
                        {
                            type: ApplicationCommandOptionType.String,
                            description: "Description rapide du bug que vous avez retrouvé.",
                            required: true,
                            name: "description"
                        },
                        {
                            type: ApplicationCommandOptionType.Attachment,
                            name: "image",
                            description: "Image/Vidéo qui permettrait au développeur de repérer d'où vient le bug que vous avez trouvé.",
                            required: false
                        }

                    ]
                }
            ],
            guild_id: config.mainguildid
        });
    }

    async run(client: Class, interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "submit": {
                const image = interaction.options.getAttachment("image")

                const buglogs = client.channels.cache.get(channels.buglogs) as TextChannel

                if (!buglogs) return interaction.reply(`**${client.emotes.no} ➜ Le système de signalement des bugs est désactivé.**`)

                const user = interaction.options.getUser("bot")

                if (!user!.bot) return interaction.reply(`**${client.emotes.no} ➜ Les plus grands chercheurs se sont penchés sur la question, mais aucun d'entre eux n'a réussi à trouver un bug sur le corps humain...**`)

                const data = await bots.findOne({ botId: user!.id, receiveBugs: true })

                if (!data) return interaction.reply(`**${client.emotes.no} ➜ Ce robot n'est pas sur la liste ou alors son développeur n'accepte pas de recevoir des signalements de bugs.**`)

                if (image && !image?.contentType?.startsWith("image")) return interaction.reply({ content: `**${client.emotes.no} ➜ Seuls les images sont prises en charge.**`, ephemeral: true })

                let comp = []

                if (data.bugThread && client.channels.cache.get(data.bugThread) as ThreadChannel) comp.push({
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            emoji: { name: "🔗" },
                            label: "Voir le fil",
                            url: `https://discord.com/channels/${interaction.guild!.id}/${data.bugThread}`
                        }
                    ]
                })

                await buglogs.send({
                    content: `<@${data.ownerId}>${data.team!.length > 0 ? `, ${data.team!.map((x: string) => `<@${x}>`).join(", ")}` : ""}`,
                    embeds: [
                        {
                            title: "Nouveau bug signalé !",
                            thumbnail: {
                                url: interaction.user.displayAvatarURL()
                            },
                            footer: {
                                text: "Version " + client.version
                            },
                            timestamp: new Date().toISOString(),
                            color: client.config.color.integer,
                            description: data.bugThread && client.channels.cache.get(data.bugThread) as ThreadChannel ? `🐛 \`${interaction.user.tag}\` vient tout juste de **trouver un bug** sur \`${user!.tag}\`. Rends toi sur le fil dédié à ton robot en cliquant sur le bouton juste en dessous !` : `🐛 \`${interaction.user.tag}\` vient tout juste de **trouver un bug** sur \`${user!.tag}\`. Rends toi sur le fil juste en dessous pour plus d'informations !`
                        }
                    ],
                    components: comp || []
                }).then(async (message: Message) => {
                    let thread: ThreadChannel;
                    //@ts-ignore
                    if (!data.bugThread || !client.channels.cache.get(data.bugThread) as ThreadChannel) {
                        message.startThread({ name: `Bug(s) signalé(s) sur ${user!.username}` }).then((t: ThreadChannel) => {
                            thread = t
                        })
                    }
                    if (data.bugThread && client.channels.cache.get(data.bugThread) as ThreadChannel) {
                        thread = client.channels.cache.get(data.bugThread) as ThreadChannel
                    }

                    setTimeout(async () => {
                        if (thread) thread.send({
                            content: `<@${interaction.user.id}> veuillez détailler ici comment en êtes vous arrivé(e) à tomber sur ce bug pour que l'équipe de <@${data.botId}> puisse avoir le plus de facilités possible pour régler ce problème.`,
                            embeds: [
                                {
                                    footer: {
                                        text: "Version " + client.version
                                    },
                                    timestamp: new Date().toISOString(),
                                    color: client.config.color.integer,
                                    description: `\`\`\`md\n# ${interaction.options.getString("description")}\`\`\``,
                                    image: image && image?.contentType?.startsWith("image") ? { url: image.url, proxy_url: image.proxyURL, height: image.height || undefined, width: image.width || undefined } : undefined
                                }
                            ],
                            components: []
                        }).then(async (msg: Message) => {
                            data.bugThread = thread.id
                            data.bugs.push({
                                submitter: interaction.user.id,
                                status: 0,
                                msgId: msg.id
                            })
                            data.save()

                            msg.edit({
                                content: `<@${interaction.user.id}> veuillez détailler ici comment en êtes vous arrivé(e) à tomber sur ce bug pour que l'équipe de <@${data.botId}> puisse avoir le plus de facilités possible pour régler ce problème.`,
                                embeds: [
                                    {
                                        footer: {
                                            text: "Interagissez avec le bouton ci-dessous ! - Version " + client.version
                                        },
                                        timestamp: new Date().toISOString(),
                                        color: client.config.color.integer,
                                        description: `\`\`\`md\n# ${interaction.options.getString("description")}\`\`\``,
                                        image: image && image?.contentType?.startsWith("image") ? { url: image.url, proxy_url: image.proxyURL, height: image.height || undefined, width: image.width || undefined } : undefined
                                    }
                                ],
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            {
                                                type: 2,
                                                style: 1,
                                                customId: `${data.botId}.${msg.id}.bugChangeStatus`,
                                                label: "Modifier le statut",
                                                emoji: { name: "📝" }
                                            }
                                        ]
                                    }
                                ]
                            })

                            interaction.reply({
                                content: `**${client.emotes.yes} ➜ Signalement envoyé au développeur. Vous pouvez détailler votre signalement dans le <#${thread.id}>.**`
                            })
                        })
                    }, 1000)
                })
                break;
            }

            case "toggle": {
                const user = interaction.options.getUser("bot")

                if (!user!.bot) return interaction.reply(`**${client.emotes.no} ➜ Veuillez entrer un bot.**`)

                const data = await bots.findOne({ botId: user!.id })

                // @ts-ignore
                if (!data || !interaction.member!.roles!.cache.has(roles.verificator) && interaction.user.id !== data!.ownerId && data.team && !data.team.includes(interaction.user.id)) return interaction.reply(`**${client.emotes.no} ➜ Ce bot n'est pas listé ou ne vous appartient pas.**`)

                data.receiveBugs = data.receiveBugs !== true
                data.save()

                interaction.reply({
                    content: `**${client.emotes.yes} ➜ Vous avez bien ${data.receiveBugs === true ? `autorisé les membres à vous signaler des bugs sur ${user!.tag}.` : `supprimé l'autorisation aux membres de vous signaler des bugs sur ${user!.tag}.`}**`,
                    ephemeral: true
                })

                break;
            }
        }
    }
}

export = new Bugs();