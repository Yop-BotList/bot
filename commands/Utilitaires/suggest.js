'use strict';

const { MessageButton, MessageEmbed, MessageActionRow } = require("discord.js");
const Command = require("../../structure/Command.js"),
      { bof } = require("../../configs/emojis.json"),
      channels = require("../../configs/channels.json"),
      { prefix } = require("../../configs/config.json"),
      suggests = require("../../models/suggests"),
      packages = require("../../package.json"),
      botconfig = require("../../models/botconfig");


class Suggest extends Command {
    constructor() {
        super({
            name: 'suggest',
            category: 'utils',
            description: 'Gérer les suggestions.',
            aliases: ["suggestion", "sugg"],
            example: ["suggest Ajouter le bot Dyno.", "sugg reject Pour quoi faire ?"],
            perms: 'everyone',
            usage: 'suggest <suggestion | accept | reject | mask | list> [commentaire]',
            cooldown: 5
        });
    }

    async run(client, message, args) {
                // create
                if (!args[0]) return message.channel.send(`\`\`\`${prefix}suggest <suggestion | accept | reject | mask | list>\`\`\``)
                if (args[0] !== ("accept" || "reject" || "mask" || "list")) {
                    const db = await botconfig.findOne()
                        
                    const e = new MessageEmbed()
                    .setTitle(`Nouvelle suggestion de ${message.author.username} ! (N°${db.suggests + 1})`)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(client.color)
                    .setTimestamp(new Date())
                    .setDescription(`\`\`\`md\n# ${args.join(' ')}\n\`\`\`\n**Réagissez :**\n${client.yes} = Oui\n${bof} = Pourquoi pas ?\n${client.no} = Non`)
                    client.channels.cache.get(channels.suggests).send({ embeds: [e] }).then(async(msg) => {
                        msg.react('900773800973565972')
                        msg.react('900773799035818024')
                        msg.react('900773800193437697')
            
                        // database
                        new suggests({
                            userID: message.author.id,
                            msgID: msg.id,
                            suggID: db.suggests + 1,
                            accepted: false,
                            deleted: false,
                            content: args.slice(1).join(" ")
                        }).save()
                        if (db) await botconfig.findOneAndUpdate({ suggests: db.suggests + 1 })
                        
            
                        return message.channel.send(`**${client.yes} ➜ Votre suggestion a bien été envoyée. Allez voir dans le <#${channels.suggests}>.**`)
                    });
                }
        
                // accept
                if (args[0] === "accept") {
                    if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
                    if (!args[1]) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion.**`)
                    const db = await suggests.findOne({ suggestID: args[0], accepted: false, deleted: false });
                    if (!db) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`)
                    const member = message.guild.members.cache.get(db.userID),
                          reason = args.slice(2).join(" ") || `Aucun commentaire...`
        
                    message.guild.channels.cache.get(channels.suggests).messages.fetch(db.msgID).then(async (msg) => {
                        const e1 = new MessageEmbed()
                        .setTitle(`Suggestion de ${member.user.username} acceptée par ${message.author.username} !`)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setColor(client.color)
                        .setTimestamp(new Date())
                        .setDescription(`\`\`\`md\n# ${db.content}\n\`\`\``)
                        .addField(`Commentaire de ${message.author.username} :`, `\`\`\`diff\n+ ${reason}\n\`\`\``)
        
                        msg.edit({ embeds: [e1] });
        
                        await suggests.findOneAndUpdate({ suggID: db.suggID }, { $set: { accepted: true } }, { upsert: true });
        
                        const e2 = new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<@${message.author.id}> vient tout juste d'accepter votre [suggestion](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) ! Merci à toi !`)
        
                        message.guild.channels.cache.get(channels.sugglogs).send({ content: `<@${db.userID}>`, embeds: [e2] })
        
                        message.channel.send(`**${client.yes} ➜ La suggestion a bien été acceptée !**`)
                    })
                }
        
                // reject
                if (args[0] === "reject") {
                    if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
                    if (!args[1]) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion.**`)
                    const db = await suggests.findOne({ suggestID: args[0], accepted: false, deleted: false });
                    if (!db) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`)
                    const member = message.guild.members.cache.get(db.userID),
                          reason = args.slice(2).join(" ")
        
                    if (!reason) return message.channel.send(`**${client.no} ➜ Veuillez entrer une raison.**`)
        
                    message.guild.channels.cache.get(channels.suggests).messages.fetch(db.msgID).then(async (msg) => {
                        const e1 = new MessageEmbed()
                        .setTitle(`Suggestion de ${member.user.username} refusée par ${message.author.username} !`)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setColor(client.color)
                        .setTimestamp(new Date())
                        .setDescription(`\`\`\`md\n# ${db.content}\n\`\`\``)
                        .addField(`Commentaire de ${message.author.username} :`, `\`\`\`diff\n- ${reason}\n\`\`\``)
        
                        msg.edit({ embeds: [e1] });
        
                        await suggests.findOneAndUpdate({ suggID: db.suggID }, { $set: { accepted: true } }, { upsert: true });
        
                        const e2 = new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<@${message.author.id}> vient tout juste de refuser votre [suggestion](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) ! Merci quand même d'avoir proposé quelque chose !`)
        
                        message.guild.channels.cache.get(channels.sugglogs).send({ content: `<@${db.userID}>`, embeds: [e2] })
        
                        message.channel.send(`**${client.yes} ➜ La suggestion a bien été refusée !**`)
                    })
                }
        
                // mask
                if (args[0] === "mask") {
                    if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
                    if (!args[1]) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion.**`)
                    const db = await suggests.findOne({ suggestID: args[1], accepted: false, deleted: false });
                    if (!db) return message.channel.send(`**${client.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`)
                    const member = message.guild.members.cache.get(db.userID)
        
                    message.guild.channels.cache.get(channels.suggests).messages.fetch(db.msgID).then(async (msg) => {
                        const e1 = new MessageEmbed()
                        .setTitle(`Suggestion de ${member.user.username} masquée par ${message.author.username} !`)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setColor(client.color)
                        .setTimestamp(new Date())
                        .setDescription(`\`\`\`md\n# Contenu masqué\n\`\`\``)
        
                        msg.edit({ embeds: [e1] });
        
                        await suggests.findOneAndUpdate({ suggID: db.suggID }, { $set: { deleted: true } }, { upsert: true });
        
                        const e2 = new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<@${message.author.id}> vient tout juste de masquer votre [suggestion](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) ! Veuillez faire attention à l'avenir !`)
        
                        message.guild.channels.cache.get(channels.sugglogs).send({ content: `<@${db.userID}>`, embeds: [e2] })
        
                        message.channel.send(`**${client.yes} ➜ La suggestion a bien été masquée !**`)
                    })
                }
        
                // list
                if (args[0] === "list") {
                    if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`)
                    let suggGet = await suggests.find({ accepted: false, deleted: false });
                    if (!suggGet) return message.reply(`**${client.no} ➜ Aucune suggestion n'est en attente de réponse sur le serveur.**`);
                    
                    let i0 = 0;
                    let i1 = 10;
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
                    if (page === Math.ceil(suggGet.length/10)) rightPage.setDisabled();
        
                    let buttons = new MessageActionRow()
                    .addComponents(leftPage, deleteMsg, rightPage)
        
                    let array = suggGet.sort((a, b) => (a.suggID < b.suggID) ? 1 : -1),
                        description = `${array.map((r, i) => `**${i + 1}** ➜ ID ${r.suggID} - \`${client.users.cache.get(r.userID)?.tag} (${r.userID})\``).slice(0, 10).join("\n")}`,
                        footer = `Page ${page}/${Math.ceil(suggGet.length/10)}`,
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
                            i0 = i0 - 10;
                            i1 = i1 - 10;
                            page = page - 1;
        
                            if (page < Math.ceil(suggGet.length/10)) return await msg.delete();
        
                            if (page === Math.ceil(suggGet.length/10)) leftPage.setDisabled();
                            else leftPage.setDisabled(false);
                            rightPage.setDisabled(false);
        
                            buttons = new MessageActionRow()
                            .addComponents(leftPage, deleteMsg, rightPage);
        
                            description = `${array.map((r, i) => `**${i + 1}** ➜ ID ${r.suggID} - \`${client.users.cache.get(r.userID)?.tag} (${r.userID})\``).slice(i0, i1).join("\n")}`;
                            footer = `Page ${page}/${Math.ceil(suggGet.length/10)}`;
        
                            embed.setDescription(description).setFooter(footer);
        
                            await button.update({ content: null, embeds: [embed], components: [buttons] });
                        }
                        // right
                        if (button.customId === "suggRightPage") {
                            i0 = i0 + 10;
                            i1 = i1 + 10;
                            page = page + 1;
        
                            if (page > Math.ceil(suggGet.length/10)) return await msg.delete();
        
                            if (page === Math.ceil(suggGet.length/10)) leftPage.setDisabled();
                            else leftPage.setDisabled(false);
                            rightPage.setDisabled(false);
        
                            buttons = new MessageActionRow()
                            .addComponents(leftPage, deleteMsg, rightPage);
        
                            description = `${array.map((r, i) => `**${i + 1}** ➜ ID ${r.suggID} - \`${client.users.cache.get(r.userID)?.tag} (${r.userID})\``).slice(i0, i1).join("\n")}`;
                            footer = `Page ${page}/${Math.ceil(suggGet.length/10)}`;
                            
                            embed.setDescription(description).setFooter(footer);
        
                            await button.update({ content: null, embeds: [embed], components: [buttons] });
                        }
                    });
                }
    }
}

module.exports = new Suggest;
