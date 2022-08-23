import { Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import bots from "../../models/bots";
import Command from "../../utils/Command";

class Setsupport extends Command {
    constructor() {
        super({
            name: 'setsupport',
            category: 'Botlist',
            description: 'Définir le serveur support d\'un bot.',
            aliases: ["botsupport"],
            usage: 'setsupport <id> <support_link>',
            example: ["setsupport 692374264476860507 https://discord.gg/3dQeTg9Vz3"],
            cooldown: 5,
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        const member = await client.users.fetch(args[0]).catch(() => {});
        if (!member) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant valide.**`);

        const db = await bots.findOne({ botId: member.id });
        if (!db) return message.reply("**" + client.emotes.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**');

        if (db.ownerId !== message.author.id && !message.member!.roles.cache.get(roles.verificator)) return message.reply("**" + client.emotes.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**");

        if (!args[1]) return message.reply("**" + client.emotes.no + ' ➜ Il faudrai peut-être entrer un lien vers un serveur discord non ?**');

        if ((args[1] === "none") && !db.supportInvite) return message.reply("**" + client.emotes.no + ' ➜ Tu m\'as demandé supprimer un lien de support qui n\'a jamais été enregistrée ¯\\_(ツ)_/¯**');

        const channel = client.channels.cache.get(channels.botslogs);

        if ((args[1] === "none") && db.supportInvite) {
            channel?.isTextBased() ? channel.send({
                content: `<@${db.ownerId}>`, embeds: [
                    {
                        color: client.config.color.integer,
                        title: "Modification du profil...",
                        thumbnail: {
                            url: member.displayAvatarURL()
                        },
                        timestamp: new Date().toISOString(),
                        description: `<@${message.author.id}> vient juste d'éditer l'url du support de votre robot <@${member.id}> :`,
                        fields: [
                            {
                                name: "➜ Avant :",
                                value: `\`\`\`${db.supportInvite}\`\`\``,
                                inline: false
                            }, {
                                name: "➜ Après :",
                                value: `\`\`\`Aucune\`\`\``,
                                inline: false
                            }
                        ]
                    }
                ]
            })
                : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

            setTimeout(() => {
                db.supportInvite = "";
                return db.save();
            }, 1000)

            return message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
        }

        if (!args[1].startsWith("https://discord.gg/")) return message.reply({ content: `**${client.emotes.no} ➜ Merci d'entrer un lien valide avec un format comme celui ci \`https://discord.gg/<lien>\`**` });

        channel?.isTextBased() ? channel.send({
            content: `<@${db.ownerId}>`, embeds: [
                {
                    color: client.config.color.integer,
                    title: "Modification du profil...",
                    thumbnail: {
                        url: member.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    description: `<@${message.author.id}> vient juste d'éditer l'url du support de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "➜ Avant :",
                            value: `\`\`\`${db.supportInvite}\`\`\``,
                            inline: false
                        }, {
                            name: "➜ Après :",
                            value: `\`\`\`${args[1]}\`\`\``,
                            inline: false
                        }
                    ]
                }
            ]
        })
            : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

        setTimeout(() => {
            db.supportInvite = args[1];
            db.save();
        }, 1000);

        message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
    }
}

export = new Setsupport;