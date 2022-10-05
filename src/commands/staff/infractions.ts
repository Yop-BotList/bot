import { Message, ButtonInteraction, CollectorFilter } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import moment from "moment";
import { users } from "../../models"
import parseDuration from "../../functions/parseDuration"

class Infractions extends Command {
    constructor() {
        super({
            name: 'infractions',
            category: 'Staff',
            description: 'Recevoir la liste des infractions d\'un membre ou gérer une infraction.',
            usage: 'infractions <user | code>',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ModerateMembers", "BanMembers"],
            perms: ["ManageMessages"],
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

            let description = data?.warns.map(async (warn) => `**[${warn?.id} - ${warn?.type}] - le ${moment(warn?.date).format("DD/MM/YY")} - par ${client.users.cache.get(warn.modId!) ? client.users?.cache.get(warn.modId!)?.tag : "<@" + warn?.modId + ">"}${warn?.duration !== null && warn?.duration! > 0 ? ` - durant ${parseDuration(warn.duration!)}` : ""}**\n` + "```md\n# " + warn?.reason + "```").slice(i0, i1).join("\n");

            console.log(typeof description)
            console.log(description)

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
                    const filter = (btn: ButtonInteraction) => btn.user.id === message.author.id;
                    // @ts-ignore
                    const collector = m.createMessageComponentCollector({ filter, time: 60000 });

                    collector.on("collect", async (button: ButtonInteraction) => {
                        button.deferUpdate()
                        if (button.customId === "servsLeftPage") {
                            i0 = i0 - 10;
                            i1 = i1 - 10;
                            page = page - 1;

                            if (page < 1) return collector.stop();

                            description = data?.warns.map(async (warn) => `**[${warn?.id} - ${warn?.type}] - le ${moment(warn?.date).format("DD/MM/YY")} - par ${client.users.cache.get(warn.modId!) ? client.users?.cache.get(warn.modId!)?.tag : "<@" + warn?.modId + ">"}${warn?.duration !== null && warn?.duration! > 0 ? ` - durant ${parseDuration(warn.duration!)}` : ""}**\n` + "```md\n# " + warn?.reason + "```").slice(i0, i1).join("\n")

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

                            description = data?.warns.map(async (warn) => `**[${warn?.id} - ${warn?.type}] - le ${moment(warn?.date).format("DD/MM/YY")} - par ${client.users.cache.get(warn.modId!) ? client.users?.cache.get(warn.modId!)?.tag : "<@" + warn?.modId + ">"}${warn?.duration !== null && warn?.duration! > 0 ? ` - durant ${parseDuration(warn.duration!)}` : ""}**\n` + "```md\n# " + warn?.reason + "```").slice(i0, i1).join("\n")

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

    //     const data = await infractions.findOne({ id: Number(args[0]) });
    //     if (!member && !data) return message.reply(`**${client.e.no} Membre ou infraction introuvable.**`);

    //     const member = client.users.cache.get(data.userID) || await client.users.fetch(data.userID).catch(() => null);
    //     if (!member) return message.reply(`**${client.e.no} J'ai l'impression que l'utilisateur ayant reçu cette sanction a supprimé son compte...**`);
    //     const embed = new MessageEmbed()
    //         .setTitle(`Infraction ${data.id}`)
    //         .setColor(client.embed.colors.default)
    //         .setFooter({ text: client.embed.footer.text, iconURL: client.embed.footer.icon })
    //         .setTimestamp(new Date())
    //         .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    //         .addField(`${client.e.discordicons.man} ➜ Utilisateur :`, "```md\n# " + member.tag + " (" + member.id + ")" + "```")
    //         .addField(`${client.e.badges.staff} ➜ Modérateur :`, "```md\n# " + client.users.cache.get(data.modID).tag + " (" + data.modID + ")" + "```")
    //         .addField(`${client.e.discordicons.tag} ➜ Type :`, "```md\n# " + data.type + "```")
    //         .addField(`${client.e.badges.mod} ➜ Raison :`, "```md\n# " + data.reason + "```")

    //     if (data.duration !== null) embed.addField(`${client.e.discordicons.horloge} ➜ Durée :`, "```md\n# " + prettyMilliseconds(data.duration, { compact: true }) + "```")

    //     const btnDelete = new MessageButton()
    //         .setEmoji("❌")
    //         .setLabel("Supprimer l'infraction.")
    //         .setStyle("DANGER")
    //         .setCustomId("btnDeleteInfraction")
    //     const row = new MessageActionRow()
    //         .addComponents(btnDelete)

    //     message.reply({ embeds: [embed], components: [row] })
    //     .then(async(m) => {
    //         const filter = x => x.user.id === message.author.id;
    //         const collector = m.createMessageComponentCollector({ filter, time: 60000 });
    //         collector.on("collect", async(interaction) => {
    //             if (interaction.customId === "btnDeleteInfraction") {
    //                 if (data.type === "WARN" || data.type === "KICK") {
    //                     await data.deleteOne();
    //                     m.edit({ content: `**${client.e.yes} Infraction supprimée.**`, embeds: [], components: [] });
    //                 }
    //                 if (data.type === "BAN") {
    //                     let bb = await message.guild.bans.fetch(member.id).catch(() => null);
    //                     if (!interaction.member.permissions.has("BAN_MEMBERS")) return message.reply(`**${client.e.no} Vous n'avez pas la permission de débannir des membres.**`);
    //                     if (bb) message.guild.bans.remove(member.id);
    //                     await data.deleteOne();
    //                     m.edit({ content: `**${client.e.yes} Infraction supprimée.**`, embeds: [], components: [] });
    //                 }
    //                 if (data.type === "TIMEOUT") {
    //                     if (!interaction.member.permissions.has("MODERATE_MEMBERS")) return message.reply(`**${client.e.no} Vous n'avez pas la permission de rendre la voix des membres.**`);
    //                     const user = message.guild.members.cache.get(member.id) || await message.guild.members.fetch(member.id).catch(() => null);
    //                     if (user.user) user.timeout(null)
    //                     await data.deleteOne();
    //                     m.edit({ content: `**${client.e.yes} Infraction supprimée.**`, embeds: [], components: [] });
    //                 }


    //                 const embedLogs = new MessageEmbed()
    //                     .setColor(client.embed.colors.default)
    //                     .setFooter({ text: client.embed.footer.text, iconURL: client.embed.footer.icon })
    //                     .setTimestamp(new Date())
    //                     .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    //                     .setTitle("Suppression de sanction")
    //                     .addField(`${client.e.discordicons.man} ➜ Utilisateur :`, "```md\n# " + member.tag + " (" + member.id + ")" + "```")
    //                     .addField(`${client.e.badges.staff} ➜ Modérateur :`, "```md\n# " + message.author.tag + " (" + message.author.id + ")" + "```")
    //                     .addField(`${client.e.discordicons.tag} ➜ Type :`, "```md\n# " + data.type + "```")
    //                     .addField(`${client.e.badges.mod} ➜ Raison :`, "```md\n# " + data.reason + "```")

    //                 const embedMP = new MessageEmbed()
    //                     .setColor(client.embed.colors.default)
    //                     .setFooter({ text: client.embed.footer.text, iconURL: client.embed.footer.icon })
    //                     .setTimestamp(new Date())
    //                     .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    //                     .setTitle("Suppression de sanction")
    //                     .addField(`${client.e.discordicons.man} ➜ Utilisateur :`, "```md\n# " + member.tag + " (" + member.id + ")" + "```")
    //                     .addField(`${client.e.discordicons.tag} ➜ Type :`, "```md\n# " + data.type + "```")
    //                     .addField(`${client.e.badges.mod} ➜ Raison :`, "```md\n# " + data.reason + "```")


    //                 client.channels.cache.get(db.modLogs)?.send({ embeds: [embedLogs] });
    // 	member.send({ embeds: [embedMP] }).catch(() => {})
    //             }
    //         })
    //     })
    }
}

export = new Infractions;