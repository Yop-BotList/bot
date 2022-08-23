import { Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import bots from "../../models/bots";
import Command from "../../utils/Command";

class Setdesc extends Command {
    constructor() {
        super({
            name: 'setdesc',
            category: 'Botlist',
            description: 'Définir la description d\'un bot.',
            aliases: ["botdesc"],
            usage: 'setdesc <id> <description>',
            example: ["setdesc 692374264476860507 Bonjour je suis un robot"],
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
        
        if (!args[1]) return message.reply("**" + client.emotes.no + ' ➜ Il faudrai peut-être entrer une description non ?**');
        
        if ((args[1] === "none") && !db.description) return message.reply("**" + client.emotes.no + ' ➜ Tu m\'as demandé supprimer une description qui n\'a jamais été enregistrée ¯\\_(ツ)_/¯**');
        
        const channel = client.channels.cache.get(channels.botslogs);
        
        if ((args[1] === "none") && db.description) {
            channel?.isTextBased() ? channel.send({ content: `<@${db.ownerId}>`, embeds: [
                {
                    color: client.config.color.integer,
                    title: "Modification du profil...",
                    thumbnail: {
                        url: member.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    description: `<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "➜ Avant :",
                            value: `\`\`\`${db.description}\`\`\``,
                            inline: false
                        }, {
                            name: "➜ Après :",
                            value: `\`\`\`Aucune\`\`\``,
                            inline: false
                        }
                    ]
                }
            ] })
            : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

            setTimeout(() => {
                db.description = "";
                return db.save();
            }, 1000)
            
            return message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
        }
        
        channel?.isTextBased() ? channel.send({ content: `<@${db.ownerId}>`, embeds: [
            {
                color: client.config.color.integer,
                title: "Modification du profil...",
                thumbnail: {
                    url: member.displayAvatarURL()
                },
                timestamp: new Date().toISOString(),
                description: `<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`,
                fields: [
                    {
                        name: "➜ Avant :",
                        value: `\`\`\`${db.description}\`\`\``,
                        inline: false
                    }, {
                        name: "➜ Après :",
                        value: `\`\`\`${args.slice(1).join(" ")}\`\`\``,
                        inline: false
                    }
                ]
            }
        ] })
        : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

        setTimeout(() => {
            db.description = args.slice(1).join(" ");
            db.save();
        }, 1000);
        
        message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
    }
}

export = new Setdesc;