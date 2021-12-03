'use strict';

const { MessageEmbed } = require("discord.js")
const Command = require("../../structure/Command.js"),
      { mainguildid } = require("../../configs/config.json"),
      u = require("../../models/user");

class Leaderboard extends Command {
    constructor() {
        super({
            name: 'leaderboard',
            category: 'utils',
            description: 'Voir le classement des vérificateurs.',
            aliases: ["lb", "top"],
            example: ["lb"],
            perms: 'everyone',
            usage: 'leaderboard',
            cooldown: 5
        });
    }

    async run(client, message, args) {
            const udata = await u.find();
        
            if (udata.length < 2) return message.channel.send(`**${client.no} ➜ Il n'y a pas assez de vérificateurs dans le classement pour que je puisse afficher en afficher un.**`)
            let array = udata.sort((a, b) => (a.verifications < b.verifications) ? 1 : -1).slice(0, 10);
            let forfind = udata.sort((a, b) => (a.verifications < b.verifications) ? 1 : -1);
        
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
            .setDescription(array.map((r, i) => `#${i + 1} **${client.users.cache.get(r.userID)?.tag || r.userID}** avec \`${r.verifications}\` bots vérifiés !`).join("\n"))
            message.channel.send({ embeds: [e] })
    }
}

module.exports = new Leaderboard;