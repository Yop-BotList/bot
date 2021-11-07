'use strict';

const { MessageEmbed } = require("discord.js")
const Command = require("../../structure/Command.js"),
      bot = require("../../models/bots"),
      { mainguildid } = require("../../configs/config.json"),
      user = require("../../models.user");

class Leaderboard extends Command {
    constructor() {
        super({
            name: 'leaderboard',
            category: 'utils',
            description: 'Voir les classements du serveur.',
            aliases: ["lb", "top"],
            example: ["lb staff", "top likes"],
            perms: 'everyone',
            usage: 'leaderboard <likes | staff>',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        if (args[0] !== "likes" && args[0] !== "staff") return message.reply(`**${client.no} ➜ Veuillez entrer l'un des arguments suivants : \`likes\`, \`bumps\` ou \`staff\`.**`)
        
        // likes
        if (args[0] === "likes") {
            const usersdata = await bot.find({ serverID: mainguildid });

            if (usersdata.length < 2) return message.channel.send(`**${client.no} ➜ Il n'y a pas assez de bots dans le classement pour que je puisse afficher en afficher un.**`)
            let array = usersdata.sort((a, b) => (a.likesCount < b.likesCount) ? 1 : -1).slice(0, 10);
            let forfind = usersdata.sort((a, b) => (a.likesCount < b.likesCount) ? 1 : -1);

            function estUser(user) {
                return user.botID === message.author.id;
            }
            const user = forfind.find(estUser);
            const userTried = (element) => element === user;
            let ranked = forfind.findIndex(userTried) + 1
            let first;
            if (ranked === 1) {
                first = "1"
            } else {
                first = `${ranked}`
            }
            const e = new MessageEmbed()
            .setTitle("Classement des votes du mois :")
            .setColor(client.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(array.map((r, i) => `#${i + 1} **${client.users.cache.get(r.botID).tag}** avec \`${r.likesCount}\` votes`).join("\n"))
            message.channel.send({ embeds: [e] })
        }
        if (args[0] === "staff") {
            const usersdata = await user.find({ serverID: mainguildid });
        
            if (usersdata.length < 2) return message.channel.send(`**${client.no} ➜ Il n'y a pas assez de vérificateurs dans le classement pour que je puisse afficher en afficher un.**`)
            let array = usersdata.sort((a, b) => (a.verifications < b.verifications) ? 1 : -1).slice(0, 10);
            let forfind = usersdata.sort((a, b) => (a.verifications < b.varifications) ? 1 : -1);
        
            function estUser(user) {
                return user.userID === message.author.id;
            }
            const user = forfind.find(estUser);
            const userTried = (element) => element === user;
            let ranked = forfind.findIndex(userTried) + 1
            let first;
            if (ranked === 1) {
                first = "1"
            } else {
                first = `${ranked}`
            }
            const e = new MessageEmbed()
            .setTitle("Classement des vérificateurs :")
            .setColor(client.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(array.map((r, i) => `#${i + 1} **${client.users.cache.get(r.botID).tag}** avec \`${r.likesCount}\` bots vérifiés !`).join("\n"))
            message.channel.send({ embeds: [e] })
        }
    }
}

module.exports = new Leaderboard;