'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js"),
      { loadavg, cpus, totalmem } = require('os'),
      prettyMilliseconds = require('pretty-ms');

class Stats extends Command {
    constructor() {
        super({
            name: 'stats',
            category: 'utils',
            description: 'Voir les informations sur le bot.',
            aliases: ["botinfo", "bi", "botstats"],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        let cpuCores = cpus().length;

        const e = new MessageEmbed()
        .setTitle("Informations sur le bot :")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter("Version " + client.version)
        .setTimestamp(Date())
        .setColor(client.color)
        .addField("**__:bookmark_tabs: Infos générales :__**", `> **:crown: Créateurs :** Nolhan#2508 et </ValRedstone>#6507\n**> :calendar: Date de création :** 05/04/2021\n**> :minidisc: Version :** ${client.version}`)
        .addField("**__:gear: Infos techniques :__**", `> **:floppy_disk: Bibliothèque :** Discord.JS V13\n > **:bar_chart: Utilisation du processeur :** ${(loadavg()[0]/cpuCores).toFixed(2)}% / 100% \n > **:bar_chart: Uptime :** ${prettyMilliseconds(client.uptime, {compact: true})}\n > **:bar_chart: Latence :** ${Math.sqrt(((new Date() - message.createdTimestamp)/(5*2))**2)} ms \n > **:bar_chart: Utilisation de la RAM :** ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB`)
        .addField("**__:link: Liens__**", "[GitHub](https://github.com/Nonolanlan1007/Yop-Bot) • [Serveur Support](https://discord.gg/3dQeTg9Vz3) • [Trello](https://trello.com/b/KHmaXsL4/yopbot) • [Signaler un bug](https://github.com/Nonolanlan1007/Yop-Bot/issues/new)")

        await message.channel.send({ content: null, embeds: [e] })
    }
}

module.exports = new Stats;