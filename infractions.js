// fichier d'infractions que je vais modifier (je l'avais fait en début d'année pour un client)

'use strict';

const Command = require("../../structure/Command.js"),
      infractions = require("../../models/infractions.js"),
    { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js"),
    prettyMilliseconds = require("pretty-ms"),
    moment = require("moment"),
    config = require("../../models/config.js");

class Infractions extends Command {
    constructor() {
        super({
            name: 'infractions',
            category: 'staff',
            description: 'Voir les infractions d\'un utilisateur.',
            aliases: ["warns", "sanctions"],
            usage: 'infractions <user | code>',
            example: ["infractions <@692374264476860507>", "infractions 12"],
            perms: "891409916835807242",
            cooldown: 120
        });
    }

    async run(client, message, args) {
        const db = await config.findOne()

        if (!args[0]) return message.reply(`**${client.e.no} ➜ Veuillez mentionner un utilisateur ou entrer un code d'infraction.**`)
        if (args[0].length > 10) {
            const member = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
            if (!member) return message.channel.send(`**${client.e.no} Utilisateur introuvable.**`);

            const data = await infractions.find({ userID: member.id });
            if (data.length === 0) return message.channel.send(`**${client.e.no} Aucune infraction pour cet utilisateur.**`);

            this.client = client;

            let i0 = 0;
            let i1 = 10;
            let page = 1;

            let description = data.map(x => `[\`${x.id}\`] | \`${x.type}\` | \`${client.users.cache.get(x.modID)?.tag || x.modID}\` | \`${moment(x.date).format("DD/MM/YYYY")}\` | ${x.duration !== 0 && x.duration !== null ? prettyMilliseconds(x.duration, { compact: true }) : " "}\n\`\`\`md\n# ${x.reason}\`\`\``, ).slice(i0, i1).join("\n");

            let leftPage = new MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("◀️")
                .setCustomId("servsLeftPage")
                .setDisabled(true)

            let rightPage = new MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("▶️")
                .setCustomId("servsRightPage")
            if (data.length <= 10) rightPage.setDisabled(true);

            let buttons = new MessageActionRow()
                .addComponents(leftPage, rightPage)

            const embed = new MessageEmbed()
                .setColor(this.client.embed.colors.default)
                .setThumbnail(this.client.user.displayAvatarURL())
                .setTitle(`Liste des infractions de ${member.tag}`)
                .setFooter({ text: `Page ${page}/${Math.ceil(data.length/10)}`})
                .setDescription(description);

            message.reply({ embeds: [embed], components: [buttons] })
                .then(async(m) => {
                    const filter = (btn) => btn.user.id === message.author.id;
                    const collector = m.createMessageComponentCollector({ filter });

                    collector.on("collect", async (button) => {
                        button.deferUpdate()
                        if (button.customId === "servsLeftPage") {
                            i0 = i0 - 10;
                            i1 = i1 - 10;
                            page = page - 1;

                            if (page < 1) return collector.stop();

                            if (page === 1) leftPage.setDisabled(true);
                            else leftPage.setDisabled(false);

                            rightPage.setDisabled(false);

                            buttons = new MessageActionRow()
                                .addComponents(leftPage, rightPage)

                            description = data.map(x => `[\`${x.id}\`] | \`${x.type}\` | \`${client.users.cache.get(x.modID)?.tag || x.modID}\` | \`${moment(x.date).format("DD/MM/YYYY")}\` | ${x.duration !== 0 && x.duration !== null ? prettyMilliseconds(x.duration, { compact: true }) : " "}\n\`\`\`md\n# ${x.reason}\`\`\``, ).slice(i0, i1).join("\n");

                        embed.setFooter({ text: `Page ${page}/${Math.ceil(data.length/10)}`})
                                .setDescription(description);

                            m.edit({ embeds: [embed], components: [buttons] });
                        }
                        if (button.customId === "servsRightPage") {
                            i0 = i0 + 10;
                            i1 = i1 + 10;
                            page = page + 1;

                            if (page < Math.round(data.length/10)) return collector.stop();

                            if (page >= (Math.round(data.length/10))) rightPage.setDisabled(true);
                            else rightPage.setDisabled(false);

                            leftPage.setDisabled(false);

                            buttons = new MessageActionRow()
                                .addComponents(leftPage, rightPage)

                            description = data.map(x => `[\`${x.id}\`] | \`${x.type}\` | \`${client.users.cache.get(x.modID)?.tag || x.modID}\` | \`${moment(x.date).format("DD/MM/YYYY")}\` | ${x.duration !== 0 && x.duration !== null ? prettyMilliseconds(x.duration, { compact: true }) : " "}\n\`\`\`md\n# ${x.reason}\`\`\``, ).slice(i0, i1).join("\n");

                            embed.setFooter({ text: `Page ${page}/${Math.ceil(data.length/10)}`})
                                .setDescription(description);

                            m.edit({ embeds: [embed], components: [buttons] });
                        }
                    })
                })
        }

        if (args[0].length < 18) {
            const data = await infractions.findOne({ id: Number(args[0]) });
            if (!data) return message.reply(`**${client.e.no} Infraction introuvable.**`);

            const member = client.users.cache.get(data.userID) || await client.users.fetch(data.userID).catch(() => null);
            if (!member) return message.reply(`**${client.e.no} J'ai l'impression que l'utilisateur ayant reçu cette sanction a supprimé son compte...**`);
            const embed = new MessageEmbed()
                .setTitle(`Infraction ${data.id}`)
                .setColor(client.embed.colors.default)
                .setFooter({ text: client.embed.footer.text, iconURL: client.embed.footer.icon })
                .setTimestamp(new Date())
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addField(`${client.e.discordicons.man} ➜ Utilisateur :`, "```md\n# " + member.tag + " (" + member.id + ")" + "```")
                .addField(`${client.e.badges.staff} ➜ Modérateur :`, "```md\n# " + client.users.cache.get(data.modID).tag + " (" + data.modID + ")" + "```")
                .addField(`${client.e.discordicons.tag} ➜ Type :`, "```md\n# " + data.type + "```")
                .addField(`${client.e.badges.mod} ➜ Raison :`, "```md\n# " + data.reason + "```")

            if (data.duration !== null) embed.addField(`${client.e.discordicons.horloge} ➜ Durée :`, "```md\n# " + prettyMilliseconds(data.duration, { compact: true }) + "```")

            const btnDelete = new MessageButton()
                .setEmoji("❌")
                .setLabel("Supprimer l'infraction.")
                .setStyle("DANGER")
                .setCustomId("btnDeleteInfraction")
            const row = new MessageActionRow()
                .addComponents(btnDelete)

            message.reply({ embeds: [embed], components: [row] })
            .then(async(m) => {
                const filter = x => x.user.id === message.author.id;
                const collector = m.createMessageComponentCollector({ filter, time: 60000 });
                collector.on("collect", async(interaction) => {
                    if (interaction.customId === "btnDeleteInfraction") {
                        if (data.type === "WARN" || data.type === "KICK") {
                            await data.deleteOne();
                            m.edit({ content: `**${client.e.yes} Infraction supprimée.**`, embeds: [], components: [] });
                        }
                        if (data.type === "BAN") {
                            let bb = await message.guild.bans.fetch(member.id).catch(() => null);
                            if (!interaction.member.permissions.has("BAN_MEMBERS")) return message.reply(`**${client.e.no} Vous n'avez pas la permission de débannir des membres.**`);
                            if (bb) message.guild.bans.remove(member.id);
                            await data.deleteOne();
                            m.edit({ content: `**${client.e.yes} Infraction supprimée.**`, embeds: [], components: [] });
                        }
                        if (data.type === "TIMEOUT") {
                            if (!interaction.member.permissions.has("MODERATE_MEMBERS")) return message.reply(`**${client.e.no} Vous n'avez pas la permission de rendre la voix des membres.**`);
                            const user = message.guild.members.cache.get(member.id) || await message.guild.members.fetch(member.id).catch(() => null);
                            if (user.user) user.timeout(null)
                            await data.deleteOne();
                            m.edit({ content: `**${client.e.yes} Infraction supprimée.**`, embeds: [], components: [] });
                        }


                        const embedLogs = new MessageEmbed()
                            .setColor(client.embed.colors.default)
                            .setFooter({ text: client.embed.footer.text, iconURL: client.embed.footer.icon })
                            .setTimestamp(new Date())
                            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                            .setTitle("Suppression de sanction")
                            .addField(`${client.e.discordicons.man} ➜ Utilisateur :`, "```md\n# " + member.tag + " (" + member.id + ")" + "```")
                            .addField(`${client.e.badges.staff} ➜ Modérateur :`, "```md\n# " + message.author.tag + " (" + message.author.id + ")" + "```")
                            .addField(`${client.e.discordicons.tag} ➜ Type :`, "```md\n# " + data.type + "```")
                            .addField(`${client.e.badges.mod} ➜ Raison :`, "```md\n# " + data.reason + "```")

                        const embedMP = new MessageEmbed()
                            .setColor(client.embed.colors.default)
                            .setFooter({ text: client.embed.footer.text, iconURL: client.embed.footer.icon })
                            .setTimestamp(new Date())
                            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                            .setTitle("Suppression de sanction")
                            .addField(`${client.e.discordicons.man} ➜ Utilisateur :`, "```md\n# " + member.tag + " (" + member.id + ")" + "```")
                            .addField(`${client.e.discordicons.tag} ➜ Type :`, "```md\n# " + data.type + "```")
                            .addField(`${client.e.badges.mod} ➜ Raison :`, "```md\n# " + data.reason + "```")


                        client.channels.cache.get(db.modLogs)?.send({ embeds: [embedLogs] });
			member.send({ embeds: [embedMP] }).catch(() => {})
                    }
                })
            })
        }
    }
}

module.exports = new Infractions;
