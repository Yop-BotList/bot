import { Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import bots from "../../models/bots";
import Command from "../../utils/Command";

class Setprefix extends Command {
    constructor() {
        super({
            name: 'setprefix',
            category: 'Botlist',
            description: 'Définir le préfixe d\'un bot.',
            aliases: ["botprefix"],
            usage: 'setprefix <id> <prefix>',
            example: ["setprefix 692374264476860507 ??"],
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

        if (!args[1]) return message.reply("**" + client.emotes.no + ' ➜ Il faudrai peut-être entrer un préfix non ?**');

        const channel = client.channels.cache.get(channels.botslogs);
        
        channel?.isTextBased() ? channel.send({ content: `<@${db.ownerId}>`, embeds: [
            {
                color: client.config.color.integer,
                title: "Modification du profil...",
                thumbnail: {
                    url: member.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString(),
                description: `<@${message.author.id}> vient juste d'éditer le prefix de votre robot <@${member.id}> :`,
                fields: [
                    {
                        name: "➜ Avant :",
                        value: `\`\`\`${db.prefix}\`\`\``,
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

        message.reply(`**${client.emotes.yes} ➜ Modifications enregistrées !**`);

        setTimeout(() => {
            member.setNickname(`[${args[1]}] ${member.user.username}`)

            db.prefix = args[1];
            db.save();
        }, 1000)
    }
}

export = new Setprefix;