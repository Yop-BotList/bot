const { loadavg, cpus, totalmem } = require('os'),
      prettyMilliseconds = require('pretty-ms');

exports.run = async (client, message) => {
    let cpuCores = cpus().length;

    await message.channel.send({
        embed: {
            title: client.user.username,
            color: client.color,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL(),
                text: client.user.username
            },
            thumbnail: {
                url: client.user.displayAvatarURL()
            },
            fields: [
                {
                    name: "**__:bookmark_tabs: Infos générales :__**",
                    value: "> **:crown: Créateur :** Nolhan#2508 \n > :calendar: Date de création : 05/04/2021",
                    inline: true
                },
                {
                    name: "**__:gear: Infos techniques :__**",
                    value: `> **:floppy_disk: Bibliothèque :** Discord.JS \n > **:bar_chart: Utilisation du processeur :** ${(loadavg()[0]/cpuCores).toFixed(2)}% / 100% \n > **:bar_chart: Uptime :** ${prettyMilliseconds(client.uptime, {compact: true})}\n > **:bar_chart: Latence :** ${Math.sqrt(((new Date() - message.createdTimestamp)/(5*2))**2)} ms \n > **:bar_chart: Utilisation de la RAM :** ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB`,
                    inline: true
                },
            ]
        }
    });
}

exports.help = {
    name: "stats",
    category: "utils"
}