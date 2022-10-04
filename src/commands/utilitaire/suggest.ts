import { GuildMember, Message, PermissionResolvable, TextChannel } from "discord.js";
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
        
        if (args[0] === "accept") {
            if (this.getMemberPerms(message.member!, "Administrator") !== true) return message.reply(`**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`);
            
            if (!args[1]) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant de suggestion.**`);
            
            const suggestGet = await suggests.findOne({ suggId: args[1], accepted: false, deleted: false });
            
            if (!suggestGet) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`);
            
            const member = message.guild!.members.cache.get(`${suggestGet.userId}`),
                reason = args.slice(2).join(" ") || `Aucun commentaire...`;
            
            const suggChannel = await client.channels.cache.get(channels.suggests) as TextChannel;

            const suggestMsg = await suggChannel.messages.fetch(`${suggestGet.messageId}`);

            suggestMsg.edit({
                embeds: [
                    {
                        title: `Suggestion de ${member!.user.username} acceptée par ${message.author.username} !`,
                        thumbnail: {
                            url: member!.user.displayAvatarURL()
                        },
                        color: client.config.color.integer,
                        timestamp: new Date().toISOString(),
                        description: `\`\`\`md\n# ${suggestGet.content}\n\`\`\``,
                        fields: [
                            {
                                name: `Commentaire de ${message.author.username} :`,
                                value: `\`\`\`diff\n+ ${reason}\n\`\`\``
                            }, suggestMsg.embeds[0].fields[0]
                        ]
                    }
                ],
                components: []
            });

            suggestGet.accepted = true;
            suggestGet.save();

            suggChannel.send({
                content: `<@${suggestGet.userId}>`,
                embeds: [
                    {
                        description: `<@${message.author.id}> vient tout juste d'accepter votre [suggestion](https://discord.com/channels/${suggestMsg.guild.id}/${suggestMsg.channel.id}/${suggestMsg.id}) ! Merci à toi !`,
                        color: client.config.color.integer
                    }
                ]
            });

            message.reply(`**${client.emotes.yes} ➜ La suggestion a bien été acceptée !**`);
        }

        if (args[0] === "reject") {
            if (this.getMemberPerms(message.member!, "Administrator") !== true) return message.reply(`**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`);
            
            if (!args[1]) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant de suggestion.**`);
            
            const suggestGet = await suggests.findOne({ suggId: args[1], accepted: false, deleted: false });
            
            if (!suggestGet) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`);
            
            const member = message.guild!.members.cache.get(`${suggestGet.userId}`),
                reason = args.slice(2).join(" ");

            if (!reason) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer une raison.**`);
            
            const suggChannel = await client.channels.cache.get(channels.suggests) as TextChannel;

            const suggestMsg = await suggChannel.messages.fetch(`${suggestGet.messageId}`);

            suggestMsg.edit({
                embeds: [
                    {
                        title: `Suggestion de ${member!.user.username} refusée par ${message.author.username} !`,
                        thumbnail: {
                            url: member!.user.displayAvatarURL()
                        },
                        color: client.config.color.integer,
                        timestamp: new Date().toISOString(),
                        description: `\`\`\`md\n# ${suggestGet.content}\n\`\`\``,
                        fields: [
                            {
                                name: `Commentaire de ${message.author.username} :`,
                                value: `\`\`\`diff\n– ${reason}\n\`\`\``
                            }, suggestMsg.embeds[0].fields[0]
                        ]
                    }
                ],
                components: []
            });

            suggestGet.accepted = true;
            suggestGet.save();

            suggChannel.send({
                content: `<@${suggestGet.userId}>`,
                embeds: [
                    {
                        description: `<@${message.author.id}> vient tout juste de refuser votre [suggestion](https://discord.com/channels/${suggestMsg.guild.id}/${suggestMsg.channel.id}/${suggestMsg.id}) ! Merci quand même d'avoir proposé quelque chose !`,
                        color: client.config.color.integer
                    }
                ]
            });

            message.reply(`**${client.emotes.yes} ➜ La suggestion a bien été refusée !**`);
        }

        if (args[0] === "mask") {
            if (this.getMemberPerms(message.member!, "Administrator") !== true) return message.reply(`**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cet argument.**`);
            
            if (!args[1]) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant de suggestion.**`);
            
            const suggestGet = await suggests.findOne({ suggId: args[1], accepted: false, deleted: false });
            
            if (!suggestGet) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant de suggestion valide ou sur laquelle aucune action n'a été effectuée.**`);
            
            const member = message.guild!.members.cache.get(`${suggestGet.userId}`);
            
            const suggChannel = await client.channels.cache.get(channels.suggests) as TextChannel;

            const suggestMsg = await suggChannel.messages.fetch(`${suggestGet.messageId}`);

            suggestMsg.edit({
                embeds: [
                    {
                        title: `Suggestion de ${member!.user.username} masquée par ${message.author.username} !`,
                        thumbnail: {
                            url: member!.user.displayAvatarURL()
                        },
                        color: client.config.color.integer,
                        timestamp: new Date().toISOString(),
                        description: `\`\`\`md\n# Contenu masqué\n\`\`\``,
                        fields: []
                    }
                ],
                components: []
            });

            suggestGet.deleted = true;
            suggestGet.save();

            suggChannel.send({
                content: `<@${suggestGet.userId}>`,
                embeds: [
                    {
                        description: `<@${message.author.id}> vient tout juste de masquer votre [suggestion](https://discord.com/channels/${suggestMsg.guild.id}/${suggestMsg.channel.id}/${suggestMsg.id}) ! Veuillez faire attention à l'avenir !`,
                        color: client.config.color.integer
                    }
                ]
            });

            message.reply(`**${client.emotes.yes} ➜ La suggestion a bien été masquée !**`);
        }

        if (args[0] === "list") {
            
        }
    }
    
    getMemberPerms(member: GuildMember, perm: PermissionResolvable) {
        return member.permissions.has(perm) ? true : false;
    }
}

export = new Suggest;