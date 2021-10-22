'use strict';

const Command = require("../../structure/Command.js"),
      { verificator } = require("../../configs/roles.json"),
      { Client, Message } = require("discord.js"),
      bots = require("../../models/bots"),
      moment = require("moment"),
      { mainguildid } = require("../../configs/config.json");

      moment.locale("fr")

class Setlikes extends Command {
    constructor() {
        super({
            name: 'setlikes',
            category: 'staff',
            description: 'Gérer les votes du serveur.',
            usage: 'setlikes <set | reset> <user | all> [nombre]',
            example: ["setlikes 692374264476860507 4", "setlikes reset all"],
            perms: 'ADMINISTRATOR',
            cooldown: 60
        });
    }

    async run(client, message, args) {
        if (!args[0]) return message.reply({ content: `${client.no} ➜ Merci de mettre une des deux options au lieu de aucune, \`set/reset\`.` });
    
        if (args[0] === "set") {
            let bot = message.mentions.members.first();
            if (!bot) return message.reply({ content: `${client.no} ➜ Merci de mentionner un bot.` });
            if (!bot.user || !bot.user.bot) return message.reply({ content: `${client.no} ➜ ${args[1]} n'est pas un bot.` });
            let botGet = await bots.findOne({ botID: bot.user.id });
            if (!botGet) return message.reply({ content: `${client.no} ➜ \`${bot.user.tag}\` n'est pas sur la liste.` });

            if (!args.slice(2).join(" ")) return message.reply({ content: `${client.no} ➜ Merci de me donner un nombre de votes.` });
            args.shift();

            const amount = parseInt(args[1]);

            if (isNaN(amount)) return message.reply({ content: `${client.no} ➜ Merci de mettre un nombre valide.` });

            await bots.findOneAndUpdate({
                botID: bot.user.id
            }, {
                likesCount: amount,
                likeDate: `Le ${moment().format("Do MMMM YYYY")} à ${moment().format("HH")}h${moment().format("mm")} par un administrateur.`
            }, {
                upsert: true
            });

            message.reply({ content: `${client.yes} ➜ Le nombre de likes de \`${bot.user.tag}\` est maintenant défini sur ${amount}.` });
        } else if (args[0] === "reset" && args[1] !== "all") {
            let bot = message.mentions.members.first();
            if (!bot) return message.reply({ content: `${client.no} ➜ Merci de mentionner un bot.` });
            if (!bot.user || !bot.user.bot) return message.reply({ content: `${client.no} ➜ ${args[1]} n'est pas un bot.` });
            let botGet = await bots.findOne({ botID: bot.user.id });
            if (!botGet) return message.reply({ content: `${client.no} ➜ \`${bot.user.tag}\` n'est pas sur la liste.` });

            await bots.findOneAndUpdate({
                botID: bot.user.id
            }, {
                $set: {
                    likesCount: 0,
                    likeDate: "Aucun votes"
                }
            }, {
                upsert: true
            });

            return message.reply({ content: `${client.yes} ➜ Le nombre de votes de \`${bot.user.tag}\` vient juste d'être réinitialisé.` });
        } else if (args[0] === "reset" && args[1] === "all") {
            const m = await message.reply(`**${client.yes} ➜ Approuvez-vous cette action ? Cela signifie que tous les votes vont être réinitialisés.**`)
            m.react("✅")
            m.react("❌")
            const filter = (reaction, user) => user.id === message.author.id;
            const collector = m.createReactionCollector({ filter, time: 11000000, max: 1, })
            collector.on('collect', async r => {
                if (r.emoji.name === "✅") {
                    const newchannel = await bots.find({ serverID: mainguildid });
                    newchannel.forEach(async l => {
                        const dell = await bots.findOneAndUpdate({ serverID: mainguildid, _id: l._id }, { $set: { likesCount: null, likeDate: null } }, { upsert: true });
                    })
                    return m.edit(`**${client.yes} ➜ Tous les votes ont bien été réinitialisés !**`)
                }
                if (r.emoji.name === "❌") {
                    m.edit(`**${client.yes} ➜ Action annulée avec succès !**`);
                }
            });
            collector.on('end', async collected => {
                m.reactions.removeAll()
            });
        } else return message.reply({ content: `${client.no} ➜ Merci de mettre une des deux options, \`set/reset\`.` });
    }
}

module.exports = new Setlikes;