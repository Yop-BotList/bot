import { Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import bots from "../../models/bots";
import Command from "../../utils/Command";

class Setsite extends Command {
    constructor() {
        super({
            name: 'setsite',
            category: 'Botlist',
            description: 'Définir le site web d\'un bot.',
            aliases: ["botsite"],
            usage: 'setsite <id> <site_url>',
            example: ["setsite 692374264476860507 https://discord.com"],
            cooldown: 5,
            minArgs: 2
        });
    }
    
    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        const member = await message.guild!.members.fetch(args[0]).catch(() => {});
        if (!member) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer l'indentifiant valide d'un bot présent sur ce serveur.**`);
        
        const db = await bots.findOne({ botId: member.user.id });
        if (!db) return message.reply("**" + client.emotes.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**');
        
        if (db.ownerId !== message.author.id && !message.member!.roles.cache.get(roles.verificator)) return message.reply("**" + client.emotes.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**");
        
        if (!args[1]) return message.reply("**" + client.emotes.no + ' ➜ Il faudrai peut-être entrer une url de site web non ?**');
        
        if ((args[1] === "none") && !db.site) return message.reply("**" + client.emotes.no + ' ➜ Tu m\'as demandé supprimer une url qui n\'a jamais été enregistrée ¯\\_(ツ)_/¯**');
        
        const channel = client.channels.cache.get(channels.botslogs);
        
        if ((args[1] === "none") && db.site) {
            channel?.isTextBased() ? channel.send({ content: `<@${db.ownerId}>`, embeds: [
                {
                    color: client.config.color.integer,
                    title: "Modification du profil...",
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    description: `<@${message.author.id}> vient juste d'éditer l'url du site web de votre robot <@${member.id}> :`,
                    fields: [
                        {
                            name: "➜ Avant :",
                            value: `\`\`\`${db.site}\`\`\``,
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
                db.site = "";
                return db.save();
            }, 1000)
            
            return message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
        }

        if ((args[1].startsWith("https://") || args[1].startsWith("http://")) !== true) return message.reply({ content: `**${client.emotes.no} ➜ Merci d'entrer une url valide avec un format comme ceux ci \`http://url.com\` ou \`https://url.com\`**` });
        
        channel?.isTextBased() ? channel.send({ content: `<@${db.ownerId}>`, embeds: [
            {
                color: client.config.color.integer,
                title: "Modification du profil...",
                thumbnail: {
                    url: member.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString(),
                description: `<@${message.author.id}> vient juste d'éditer l'url du site web de votre robot <@${member.id}> :`,
                fields: [
                    {
                        name: "➜ Avant :",
                        value: `\`\`\`${db.site}\`\`\``,
                        inline: false
                    }, {
                        name: "➜ Après :",
                        value: `\`\`\`${args[1]}\`\`\``,
                        inline: false
                    }
                ]
            }
        ] })
        : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

        setTimeout(() => {
            db.site = args[1];
            db.save();
        }, 1000);
        
        message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);
    }
}

export = new Setsite;