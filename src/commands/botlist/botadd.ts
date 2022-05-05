import { ChannelType, Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import bots from "../../models/bots";
import { channels, roles } from "../../configs";

class Botadd extends Command {
    constructor() {
        super({
            name: "botadd",
            category: "Botlist",
            description: "Ajoute un bot à la liste.",
            usage: "botadd <id> <prefix>",
            aliases: ["addbot"],
            cooldown: 10,
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        if (message.mentions.members?.first() || message.mentions.users.first()) return message.reply({ content: `**${client.emotes.no} ➜ Désolé je ne prend pas en charge les mentions.**` });

        const user = await client.users.fetch(args[0]).catch(() => null);
        if (!user) return message.reply({ content: `**${client.emotes.no} ➜ Je ne trouve pas l'utilisateur.**` });
        if (!user.bot) return message.reply({ content: `**${client.emotes.no} ➜ Cet utilisateur n'est pas un bot.**` });

        const channel = client.channels.cache.get(channels.botslogs);
        if (channel?.type !== ChannelType.GuildText) throw new Error("Le channel botslogs n'est pas un channel textuel ou n'a pas été trouvé.");

        if (await bots.findOne({ botId: user.id })) return message.reply({ content: `**${client.emotes.no} ➜ Ce bot est déjà dans la liste.**` });

        new bots({
            botId: user.id,
            botPrefix: args[1],
            ownerId: message.author.id,
            verified: false
        }).save();

        channel.send({
            content: `<@${message.author.id}> / <@&${roles.verificator}>`,
            embeds: [
                {
                    title: "Demande d'ajout...",
                    description: `<@${message.author.id}> a demandé à ajouter le bot [${user.username}#${user.discriminator}](https://discord.com/oauth2/authorize?client_id=${user.id}&scope=bot%20applications.commands&permissions=0). Un vérificateur va bientôt s’occuper de lui.`,
                    color: 0x66DA61,
                    thumbnail: {
                        url: user.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        });

        message.reply({ content: `**${client.emotes.yes} ➜ Votre bot \`${user.tag}\` vient juste d'être ajouté à la liste d’attente !**` });
    }
}

export = new Botadd;