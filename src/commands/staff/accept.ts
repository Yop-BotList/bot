import { ChannelType, Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import bots from "../../models/bots";
import verificators from "../../models/verificators";
import Command from "../../utils/Command";

class Accept extends Command {
    constructor() {
        super({
            name: 'accept',
            category: 'Staff',
            description: 'Accepter un bot sur la liste.',
            usage: 'accept <bot>',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ManageRoles", "ManageNicknames"],
            requiredRole: roles.verificator,
            minArgs: 1
        });
    }

    async run(client: Class, message: Message): Promise<Message<boolean> | undefined> {
        const member = message.mentions.members?.first();
        if (!member?.user.bot) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas mentionné de bots, ou alors, il n'est pas présent sur le serveur.**` });

        const channel = client.channels.cache.get(channels.botslogs);
        if (channel?.type !== ChannelType.GuildText) throw new Error("Le channel botslogs n'est pas un channel textuel ou n'a pas été trouvé.");

        let getBot = await bots.findOne({ botId: member.user.id });
        if (!getBot) return message.reply({ content: `**${client.emotes.no} ➜ ${member.user.tag} n'est pas sur la liste.**` });
        if (getBot.verified === true) return message.reply({ content: `**${client.emotes.no} ➜ ${member.user.tag} est déjà vérifié.**` });

        getBot.verified = true;
        getBot.save();

        getBot = await bots.findOne({ botId: member.user.id });
        
        channel.send({
            content: `<@${getBot!.ownerId}>`,
            embeds: [
                {
                    title: "Acceptation...",
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
                    color: 0x00FF2A,
                    footer: {
                        text: `Pense à laisser un avis au serveur via la commande ${client.config.prefix}avis ^^`
                    },
                    description: `<@${message.author.id}> vient juste d'accepter le bot ${member.user.username} !`
                }
            ]
        });

        message.channel.send({ content: `**${client.emotes.yes} ➜ Le bot ${member.user.tag} vient bien d'être accepté !**` });

        const owner = message.guild?.members.cache.get(`${getBot!.ownerId}`);
        if (!owner) return;

        owner.user.send({
            content: null,
            embeds : [
                {
                    title: "Acceptation...",
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
                    color: 0x00FF2A,
                    footer: {
                        text: `Pense à laisser un avis au serveur via la commande ${client.config.prefix}avis ^^`
                    },
                    description: `Votre bot \`${member.user.tag}\` vient juste d'être accepté par nos vérificateurs.\nN'oublie pas nous laisser un avis via la commande \`${client.config.prefix}avis\` !`
                }
            ]
        });

        member.roles.remove(roles.botintests);
        member.roles.add(roles.listedbot);
        owner.roles.add(roles.isclient);

        getBot?.team.forEach((teammate: string) => {
            client.guilds.cache.get(client.config.mainguildid)?.members.cache.get(teammate)?.roles.add(roles.isclient).catch(() => {});
        });

        const verificator = await verificators.findOne({ userId: message.author.id })
        if (verificator) {
            verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
            verificator.save();
        }
        if (!verificator) new verificators({
            userId: message.author.id,
            verifications: 1
        }).save()
    }
}

export = new Accept;