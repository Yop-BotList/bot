import { Message } from "discord.js";
import Class from "../..";
import { counter } from "../../models";
import { users } from "../../models";
import Command from "../../utils/Command";

class Counter extends Command {
    constructor() {
        super({
            name: "counter",
            category: "Utilitaire",
            description: 'Voir les plus grands compteurs du serveur.',
            aliases: ['count'],
            cooldown: 5,
            minArgs: 1,
            example: ['counter <leaderboard/objectifs/me>'],
            usage: 'counter <leaderboard/objectifs/me>'
        });
    }
    
    async run(client: Class, message: Message, args: string[]) {
        if (args[0] === "leaderboard") {
            const userData = await users.find();
            
            if (!userData || userData.length < 2) return message.reply(`**${client.emotes.no} ➜ Il n'y a pas assez de compteurs dans le classement pour que je puisse afficher en afficher un.**`);
            let array = userData.sort((a, b) => (a.totalNumbers < b.totalNumbers) ? 1 : -1).slice(0, 10);
            let fullList = userData.sort((a, b) => (a.totalNumbers < b.totalNumbers) ? 1 : -1);
            let listQuiSertJustePourLaListePrecedente = userData.sort((a, b) => (a.totalNumbers < b.totalNumbers) ? 1 : -1); //ne pas supprimer
            
            array = array.filter(element => element.totalNumbers !== 0);
            
            let footerText = "";
            
            fullList.map((r, i) => {
                (r.userId === message.author.id ? footerText = `#${i + 1} ${client.users.cache.get(`${r.userId}`)?.tag || r.userId} avec ${r.totalNumbers} numéros !` : "");
            });
            
            message.reply({
                embeds: [
                    {
                        title: "Classement des compteurs :",
                        color: client.config.color.integer,
                        thumbnail: {
                            url: `${message.guild?.iconURL()}`
                        },
                        description: array.map((r, i) => `#${i + 1} **${client.users.cache.get(`${r.userId}`)?.tag || r.userId}** avec \`${r.totalNumbers}\` numéros !` + (r.userId === message.author.id ? " <- Ici" : "")).join("\n"),
                        footer: {
                            text: footerText
                        }
                    }
                ]
            });
        }
        if (args[0] === "objectifs") {
            const objectifs: any[] = [];
            const counterDb = await counter.findOne();

            if (!counterDb) return message.reply({
                content: `**${client.emotes.no} ➜ Impossible d'afficher les objectifs car le compteur n'est pas mis en place.**`
            });

            client.counterObjectifs.forEach((objectif: number) => {
                (objectif < counterDb!.counter) ?
                    objectifs.push(`**${client.emotes.yes} Atteint ➜ ${objectif}**`) :
                    objectifs.push(`**${client.emotes.no} Non atteint ➜ ${objectif}**`);
            });

            message.reply({
                embeds: [
                    {
                        title: "Liste des objectifs du compteur.",
                        color: client.config.color.integer,
                        thumbnail: {
                            url: `${message.guild?.iconURL()}`
                        },
                        description: objectifs.join("\n")
                    }
                ]
            });
        }
    }
}

export = new Counter;