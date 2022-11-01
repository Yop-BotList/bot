import { Message, ButtonInteraction, SelectMenuInteraction } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import moment from "moment";
import { users } from "../../models"
import parseDuration from "../../functions/parseDuration"
import EditInfractionReasonModal from "../../modals/EditInfractionReasonModal";
import SendModal from "../../utils/SendModal";

class Infractions extends Command {
    constructor() {
        super({
            name: 'infractions',
            category: 'Staff',
            description: 'Recevoir la liste des infractions d\'un membre ou gérer une infraction.',
            usage: 'infractions <user | code>',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ModerateMembers", "BanMembers"],
            perms: ["ManageMessages", "BanMembers", "KickMembers", "ModerateMembers"],
            minArgs: 1
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        if (!args[0]) return message.reply(`**${client.emotes.no} ➜ Veuillez mentionner un utilisateur ou entrer un code d'infraction.**`)

        const member = message.mentions.members?.first() || await message?.guild?.members.fetch(args[0]).catch(() => null);

        if (member) {
            const data = await users.findOne({ userId: member.id });

            if (data?.warns.length === 0) return message.reply(`**${client.emotes.no} Aucune infraction pour cet utilisateur.**`);

            let i0 = 0;
            let i1 = 10;
            let page = 1;

            let description = `${data?.warns.map((warn) => `**[${warn?.id} - ${warn?.type}] - le ${moment(warn?.date).format("DD/MM/YY")} - par ${client.users.cache.get(warn.modId!) ? client.users?.cache.get(warn.modId!)?.tag : "<@" + warn?.modId + ">"}${warn?.duration !== null && warn?.duration! > 0 ? ` - durant ${parseDuration(warn.duration!)}` : ""}**\n\`\`\`md\n# ${warn.reason?.replace(/`/g, "\`")}\`\`\``).slice(i0, i1).join("\n")}`;

            message.reply({
                embeds: [
                    {
                        title: `Liste des infractions de ${member.user.tag} :`,
                        thumbnail: {
                            url: member.user.displayAvatarURL()
                        },
                        color: client.config.color.integer,
                        footer: {
                            text: `Page ${page}/${Math.ceil(data!.warns.length/10)}`
                        },
                        description: description
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 1,
                                emoji: {
                                    name: "◀"
                                },
                                custom_id: "leftPage",
                                disabled: true
                            },
                            {
                                type: 2,
                                style: 1,
                                emoji: {
                                    name: "▶"
                                },
                                custom_id: "rightPage",
                                disabled: data!.warns.length > i1 ? false : true
                            }
                        ]
                    }
                ]
            }).then(async(m) => {
                    const filter = (btn: any) => btn.user.id === message.author.id;
                    const collector = m.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on("collect", async (button: ButtonInteraction) => {
                        button.deferUpdate()
                        if (button.customId === "servsLeftPage") {
                            i0 = i0 - 10;
                            i1 = i1 - 10;
                            page = page - 1;

                            if (page < 1) return collector.stop();

                            description = `${data?.warns.map((warn) => `**[${warn?.id} - ${warn?.type}] - le ${moment(warn?.date).format("DD/MM/YY")} - par ${client.users.cache.get(warn.modId!) ? client.users?.cache.get(warn.modId!)?.tag : "<@" + warn?.modId + ">"}${warn?.duration !== null && warn?.duration! > 0 ? ` - durant ${parseDuration(warn.duration!)}` : ""}**\n` + "```md\n# " + warn?.reason + "```").slice(i0, i1).join("\n")}`

                            m.edit({
                                embeds: [
                                    {
                                        title: `Liste des infractions de ${member.user.tag} :`,
                                        thumbnail: {
                                            url: member.user.displayAvatarURL()
                                        },
                                        color: client.config.color.integer,
                                        footer: {
                                            text: `Page ${page}/${Math.ceil(data!.warns.length/10)}`
                                        },
                                        description: description
                                    }
                                ],
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            {
                                                type: 2,
                                                style: 1,
                                                emoji: {
                                                    name: "◀"
                                                },
                                                custom_id: "leftPage",
                                                disabled: page === 1 ? true : false
                                            },
                                            {
                                                type: 2,
                                                style: 1,
                                                emoji: {
                                                    name: "▶"
                                                },
                                                custom_id: "rightPage",
                                                disabled: data!.warns.length > i1 ? false : true
                                            }
                                        ]
                                    }
                                ]
                            });
                        }
                        if (button.customId === "servsRightPage") {
                            i0 = i0 + 10;
                            i1 = i1 + 10;
                            page = page + 1;

                            if (page < Math.round(data!.warns.length/10)) return collector.stop();

                            description = `${data?.warns.map((warn) => `**[${warn?.id} - ${warn?.type}] - le ${moment(warn?.date).format("DD/MM/YY")} - par ${client.users.cache.get(warn.modId!) ? client.users?.cache.get(warn.modId!)?.tag : "<@" + warn?.modId + ">"}${warn?.duration !== null && warn?.duration! > 0 ? ` - durant ${parseDuration(warn.duration!)}` : ""}**\n` + "```md\n# " + warn?.reason + "```").slice(i0, i1).join("\n")}`

                            m.edit({
                                embeds: [
                                    {
                                        title: `Liste des infractions de ${member.user.tag} :`,
                                        thumbnail: {
                                            url: member.user.displayAvatarURL()
                                        },
                                        color: client.config.color.integer,
                                        footer: {
                                            text: `Page ${page}/${Math.ceil(data!.warns.length/10)}`
                                        },
                                        description: description
                                    }
                                ],
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            {
                                                type: 2,
                                                style: 1,
                                                emoji: {
                                                    name: "◀"
                                                },
                                                custom_id: "leftPage",
                                                disabled: page === 1 ? true : false
                                            },
                                            {
                                                type: 2,
                                                style: 1,
                                                emoji: {
                                                    name: "▶"
                                                },
                                                custom_id: "rightPage",
                                                disabled: data!.warns.length > i1 ? false : true
                                            }
                                        ]
                                    }
                                ]
                            });
                        }
                    })
                })
        }

        if (member) return;
        const u = await users.find();
        let data:any;
        u.forEach((x) => {
            const y = x.warns.filter((z: any) => z.id === Number(args[0]))
            if (y.length === 1) data = y[0]
        })
        if (!member && !data) return message.reply(`**${client.emotes.no} Membre ou infraction introuvable.**`);

        const user = client.users.cache.get(data!.userId) || await client.users.fetch(data!.userId).catch(() => null);
        if (!user) return message.reply(`**${client.emotes.no} J'ai l'impression que l'utilisateur ayant reçu cette sanction a supprimé son compte...**`);

        const mod = await client.users.fetch(data!.modId).catch(() => null)

        let fields = [
            {
                name: `${client.emotes.discordicons.man} ➜ Utilisateur :`,
                value: "```md\n# " + user.tag + " (" + user.id + ")" + "```",
                inline: false
            },
            {
                name: `${client.emotes.badges.staff} ➜ Modérateur :`, 
                value: `\`\`\`md\n# ${mod ? mod!.tag : "User#0000"} (${data.modId})\`\`\``,
                inline: false
            },
            {
                name: `${client.emotes.discordicons.tag} ➜ Type :`,
                value: "```md\n# " + data.type + "```",
                inline: false
            },
            {
                name: `${client.emotes.badges.mod} ➜ Raison :`,
                value: "```md\n# " + data.reason + "```",
                inline: false
            }
        ]

        if (data.duration !== null) fields.push({ name: `${client.emotes.discordicons.horloge} ➜ Durée :`, value: "```md\n# " + parseDuration(data.duration) + "```", inline: false })

        message.reply({
            embeds: [
                {
                    title: `${data.deleted === true ? "[DELETED] - " : ""}Infraction #${data.id}`,
                    color: client.config.color.integer,
                    footer: {
                        text: `YopBot V${client.version}`
                    },
                    thumbnail: {
                        url: user.displayAvatarURL()
                    },
                    fields: fields
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 4,
                            custom_id: "btnDeleteInfraction",
                            emoji: {
                                name: "❌"
                            },
                            label: "Supprimer l'infraction.",
                            disabled: data.deleted === true ? true : false
                        },
                        {
                            type: 2,
                            style: 1,
                            custom_id: "btnEditInfraction",
                            emoji: {
                                name: "✏"
                            },
                            label: "Modifier l'infraction.",
                            disabled: data.deleted === true ? true : false
                        },
                        {
                            type: 2,
                            style: 2,
                            custom_id: "btnLogsInfraction",
                            emoji: {
                                name: "📜"
                            },
                            label: "Historique",
                            disabled: data.historyLogs.length > 0 ? false : true
                        }
                    ]
                }
            ]
        }).then(async (msg: Message) => {
            const filter = (x: any) => x.user.id === message.author.id;

            const collector = await msg.createMessageComponentCollector({ filter })

            // @ts-ignore
            collector.on("collect", async (interaction: ButtonInteraction | SelectMenuInteraction) => {
                let MsG:any;
                if (interaction.isButton()) {
                    if (interaction.customId === "btnDeleteInfraction") {
                        async function del() {
                            const uu = await users.findOne({ userId: user?.id })

                            if (!uu) return

                            data.deleted = true;
                            data.historyLogs.push({
                                title: "Suppression de l'infraction",
                                mod: message.author.id,
                                date: Date.now()
                            })
                            const array = uu.warns.filter((warn: any) => warn.id !== data.id)
                            array.push(data)
                            uu.warns = array
                            uu.save()
                        }

                        if (data.type === "WARN" || data.type === "KICK") {
                            del();
                            msg.edit({ content: `**${client.emotes.yes} ➜ Infraction supprimée.**`, embeds: [], components: [] });
                        }
                        if (data.type === "BAN") {
                            let bb = await message.guild!.bans.fetch(user.id).catch(() => null);
                            if (!message.member!.permissions.has("BanMembers")) return interaction.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas la permission de débannir des membres.**`, ephemeral: true });
                            if (bb) message.guild!.bans.remove(user.id);
                            del()
                            msg.edit({ content: `**${client.emotes.yes} ➜ Infraction supprimée.**`, embeds: [], components: [] });
                        }
                        if (data.type === "TIMEOUT") {
                            if (!message.member!.permissions.has("ModerateMembers")) return interaction.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas la permission de rendre la voix des membres.**`, ephemeral: true });
                            const mem = message.guild!.members.cache.get(user.id) || await message.guild!.members.fetch(user.id).catch(() => null);
                            if (mem!.user) mem!.timeout(null)
                            await del()
                            msg.edit({ content: `**${client.emotes.yes} Infraction supprimée.**`, embeds: [], components: [] });
                        }
                        collector.stop()
                    }
                    if (interaction.customId === "btnLogsInfraction") {

                        fields = []
                        data.historyLogs.forEach(async (action: any) => {
                            fields.push({
                                name: `Le ${moment(action.date!).format("DD/MM/YY")} par ${client.users.cache.get(action.mod!) ? client.users?.cache.get(action.mod!)?.tag : "<@" + action.mod! + ">"}`,
                                value: `> ${action.title!}`,
                                inline: true
                            })
                        })

                        interaction.reply({
                            embeds: [
                                {
                                    title: `Historique des modifications de l'infraction #${data.id}`,
                                    color: client.config.color.integer,
                                    footer: {
                                        text: `YopBot V${client.version}`
                                    },
                                    thumbnail: {
                                        url: user.displayAvatarURL()
                                    },
                                    fields: fields
                                }
                            ],
                            components: [],
                            ephemeral: true
                        })
                        collector.stop()
                    }
                    if (interaction.customId === "btnEditInfraction") {
                        let options:any;
                        options = []
                        options.push({
                            label: "Raison",
                            emoji: {
                                name: "📝"
                            },
                            description: "Modifier la raison de la sanction.",
                            value: "reason"
                        })
                        if (data.finishOn && data.finishOn > Date.now()) options.push({
                            label: "Durée",
                            emoji: {
                                name: "⏰"
                            },
                            description: "Modifier la durée de la sanction.",
                            value: "duration"
                        })


                        interaction.update({
                            content: `**${client.emotes.question} ➜ Que souhaitez-vous modifier ?**`,
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 3,
                                            custom_id: "SelectMenuToEdit",
                                            placeholder: "Sélectionner une option",
                                            options: options
                                        }
                                    ]
                                }
                            ],
                            fetchReply: true
                        }).then(async(mmmmm: Message) => MsG = mmmmm)
                    }
                }
                if (interaction.isSelectMenu()) {
                    if (interaction.customId === "SelectMenuToEdit") {
                        if (interaction.values[0] === "reason") {
                            const editmodal = new EditInfractionReasonModal(data, user);
                            SendModal(client, interaction, editmodal);
                            editmodal.handleSubmit(client, interaction);
                            collector.stop()
                        }

                        if (interaction.values[0] === "duration") {

                        }
                    }
                }
            })
        })
    }
}

export = new Infractions;