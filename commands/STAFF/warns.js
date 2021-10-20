'use strict';

const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const Command = require("../../structure/Command.js"),
      warns = require("../../models/sanction"),
      { modrole } = require("../../configs/roles.json"),
      moment = require("moment");

moment.locale("fr");

class Warns extends Command {
    constructor() {
        super({
            name: 'warns',
            category: 'staff',
            description: 'Voir les avertissements d\'un membre.',
            aliases: ["infractions"],
            usage: 'warns <utilisateur>',
            example: ["infractions <@692374264476860507>"],
            perms: modrole,
            cooldown: 15
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un utilisateur présent sur le serveur.**`)
        if (member.user.bot) return message.reply(`**${client.no} ➜ Un bot ne peut pas avoir reçu d'infractions.**`)
        const db = await warns.find({ userID: member.user.id });
        if (db.length === 0) return message.reply(`**${client.no} ➜ Ce membre n'a pas encore reçu de sanctions.**`)

        let i0 = 0;
        let i1 = 3;
        let page = 1;

        let leftPage = new MessageButton()
        .setStyle(1)
        .setEmoji("◀️")
        .setCustomId("suggLeftPage")
        .setDisabled()
        
        let deleteMsg = new MessageButton()
        .setStyle(4)
        .setEmoji("🗑️")
        .setCustomId("suggDeleteMsg")
        
        let rightPage = new MessageButton()
        .setStyle(1)
        .setEmoji("▶️")
        .setCustomId("suggRightPage")
        if (page === Math.ceil(db.length/10)) rightPage.setDisabled();

        let buttons = new MessageActionRow()
        .addComponents(leftPage, deleteMsg, rightPage)

        let array = db.sort((a, b) => (a.wrnID < b.wrnID) ? 1 : -1),
            description = `${array.map(async(r, i) => `${r.wrnID} ➜ \`${db.type}\`➜ \`${await client.users.fetch(r.modID)?.tag}\` ➜ \`${moment(db.date).format("Do/MM/YY")}\` ➜ \`\`\`${db.reason}\`\`\``).slice(0, 10).join("\n")}`,
            footer = `Page ${page}/${Math.ceil(db.length/10)}`,
            embed = new MessageEmbed()
            .setTitle(`Suggestions en attente sur le serveur.`)
            .setDescription(description)
            .setFooter(footer)

        const msg = await message.channel.send({
            content: null,
            embeds: [embed],
            components: [buttons]
        });

        const filter = i => i.customId === "suggLeftPage" || i.customId === "suggDeleteMsg" || i.customId === "suggRightPage" && i.user.id === message.author.id;
        const collector = await msg.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });

        collector.on("collect", async (button) => {
            // delete
            if (button.customId === "suggDeleteMsg") {
                if (button.user.id === message.author.id) {
                    collector.stop();
                    await msg.delete();
                }
            }
            // left
            if (button.customId === "suggLeftPage") {
                i0 = i0 - 3;
                i1 = i1 - 3;
                page = page - 1;

                if (page < Math.ceil(db.length/3)) return await msg.delete();

                if (page === Math.ceil(db.length/3)) leftPage.setDisabled();
                else leftPage.setDisabled(false);
                rightPage.setDisabled(false);

                buttons = new MessageActionRow()
                .addComponents(leftPage, deleteMsg, rightPage);

                description = `${array.map(async(r, i) => `${r.wrnID} ➜ \`${db.type}\`➜ \`${await client.users.fetch(r.modID)?.tag}\` ➜ \`${moment(db.date).format("Do/MM/YY")}\` ➜ \`\`\`${db.reason}\`\`\``).slice(0, 10).join("\n")}`;
                footer = `Page ${page}/${Math.ceil(db.length/3)}`;

                embed.setDescription(description).setFooter(footer);

                await button.update({ content: null, embeds: [embed], components: [buttons] });
            }
            // right
            if (button.customId === "suggRightPage") {
                i0 = i0 + 3;
                i1 = i1 + 3;
                page = page + 1;

                if (page > Math.ceil(db.length/3)) return await msg.delete();

                if (page === Math.ceil(db.length/3)) leftPage.setDisabled();
                else leftPage.setDisabled(false);
                rightPage.setDisabled(false);

                buttons = new MessageActionRow()
                .addComponents(leftPage, deleteMsg, rightPage);

                description = `${array.map(async(r, i) => `${r.wrnID} ➜ \`${db.type}\`➜ \`${await client.users.fetch(r.modID)?.tag}\` ➜ \`${moment(db.date).format("Do/MM/YY")}\` ➜ \`\`\`${db.reason}\`\`\``).slice(0, 10).join("\n")}`;
                footer = `Page ${page}/${Math.ceil(db.length/10)}`;
                
                embed.setDescription(description).setFooter(footer);

                await button.update({ content: null, embeds: [embed], components: [buttons] });
            }
        });
    }
}

module.exports = new Warns;
