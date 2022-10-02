import { Message, TextChannel } from "discord.js";
import Class from "../..";
import { channels } from "../../configs";
import { suggests } from "../../models";
import Command from "../../utils/Command";

class Suggest extends Command {
    constructor() {
        super({
            name: 'suggest',
            category: 'Utilitaire',
            description: `Gérer les suggestions.`,
            aliases: ["suggestion", "sugg"],
            example: ["suggest Ajouter le bot Dyno.", "sugg reject Pour quoi faire ?"],
            usage: 'suggest <suggestion | accept | reject | mask | list> [commentaire]',
            cooldown: 5,
            minArgs: 1
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        if (!["accept", "reject", "mask", "list"].includes(args[0])) {
            const suggestsList = await suggests.find();
            
            const suggChannel = client.channels.cache.get(channels.suggests) as TextChannel;

            const sugg = await suggChannel.send({
                embeds: [
                    {
                        title: `Nouvelle suggestion de ${message.author.username} ! (N°${suggestsList.length + 1})`,
                        thumbnail: {
                            url: message.author.displayAvatarURL(),
                        },
                        color: client.config.color.integer,
                        timestamp: new Date().toISOString(),
                        description: `\`\`\`md\n# ${args.join(' ')}\n\`\`\`\n**Appuiez :**\n${client.emotes.yes} = Oui\n${client.emotes.bof} = Pourquoi pas ?\n${client.emotes.no} = Non`,
                        fields: [
                            {
                                name: "Votes",
                                value: `Pour - 50% ${client.emotes.loadBar.blue.start}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.end} 50% - Contre`
                            }
                        ]
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                custom_id: "forSugg",
                                emoji: {
                                    animated: true,
                                    id: "909015463265173565",
                                    name: "oui2"
                                }
                            }, {
                                type: 2,
                                style: 2,
                                custom_id: "bofSugg",
                                emoji: {
                                    animated: true,
                                    id: "900773799035818024",
                                    name: "bof"
                                }
                            }, {
                                type: 2,
                                style: 4,
                                custom_id: "againstSugg",
                                emoji: {
                                    animated: true,
                                    id: "909015461805580298",
                                    name: "non2"
                                }
                            }
                        ]
                    }
                ]
            });

            new suggests({
                accepted: false,
                against: 0,
                for: 0,
                deleted: false,
                content: args.join(" "),
                messageId: sugg.id,
                suggId: suggestsList.length + 1,
                userId: message.author.id,
                voted: []
            }).save();

            return message.reply(`**${client.emotes.yes} ➜ Votre suggestion a bien été envoyée. Allez voir dans le <#${channels.suggests}>.**`)
        }
    }
}

export = new Suggest;