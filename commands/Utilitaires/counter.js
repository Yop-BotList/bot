'use strict';

const Command = require("../../structure/Command.js"),
      count = require("../../models/counter");

class Counter extends Command {
    constructor() {
        super({
            name: 'counter',
            category: 'utils',
            description: 'Voir les plus grands compteurs du serveur.',
            aliases: ['count']
        });
    }

    async run(client, message, args) {
        const udata = await count.find();
        
        if (udata.length < 2) return message.channel.send(`**${client.no} ➜ Il n'y a pas assez de compteurs dans le classement pour que je puisse afficher en afficher un.**`)
        let array = udata.sort((a, b) => (a.number < b.number) ? 1 : -1).slice(0, 10);
        let forfind = udata.sort((a, b) => (a.number < b.number) ? 1 : -1);
    
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
        .setTitle("Classement des compteurs :")
        .setColor(client.color)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(array.map((r, i) => `#${i + 1} **${client.users.cache.get(r.userID)?.tag || r.userID}** avec \`${r.number}\` numéros !`).join("\n"))
        message.channel.send({ embeds: [e] })
    }
}

module.exports = new Counter;