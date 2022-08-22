import { Message, version } from "discord.js";
import moment from "moment";
import { cpus, loadavg, totalmem } from "os";
import prettyMilliseconds from "pretty-ms";
import Class from "../..";
import Command from "../../utils/Command";

moment.locale("fr");

class Stats extends Command {
    constructor() {
        super({
            name: 'stats',
            category: 'Utilitaire',
            description: 'Voir les informations sur le bot.',
            aliases: ["botinfo", "bi", "botstats"],
            cooldown: 5
        });
    }

    async run(client: Class, message: Message) {
        message.reply({
            embeds: [
                {
                    title: "Informations sur le bot :",
                    thumbnail: {
                        url: client.user!.displayAvatarURL()
                    },
                    footer: {
                        text: "Version " + client.version
                    },
                    timestamp: new Date().toISOString(),
                    color: client.config.color.integer,
                    fields: [
                        {
                            name: "**__:bookmark_tabs: Infos générales :__**",
                            value: `> **:crown: Créateurs :** Nolhan#2508 et ValDesign#6507\n**> :calendar: Date de création :** ${moment(client.user!.createdAt).format('Do MMMM YYYY')}\n**> :minidisc: Version :** ${client.version}`
                        }, {
                            name: "**__:gear: Infos techniques :__**",
                            value: `> **:floppy_disk: Bibliothèque :** Discord.JS V${version}\n > **:bar_chart: Utilisation du processeur :** ${(loadavg()[0]/cpus().length).toFixed(2)}% / 100% \n > **:bar_chart: Uptime :** ${prettyMilliseconds(Number(client.uptime), { compact: true })}\n > **:bar_chart: Latence :** ${Date.now() - message.createdTimestamp} ms \n > **:bar_chart: Utilisation de la RAM :** ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB`
                        }, {
                            name: "**__:link: Liens__**",
                            value: "[GitHub](https://github.com/Nonolanlan1007/Yop-Bot) • [Serveur Support](https://discord.gg/3dQeTg9Vz3) • [Trello](https://trello.com/b/KHmaXsL4/yopbot) • [Signaler un bug](https://github.com/Nonolanlan1007/Yop-Bot/issues/new)"
                        }
                    ]
                }
            ]
        });
    }
}

export = new Stats
