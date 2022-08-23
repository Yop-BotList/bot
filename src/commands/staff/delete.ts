import { ChannelType, Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import bots from "../../models/bots";
import Command from "../../utils/Command";

class Delete extends Command {
    constructor() {
        super({
            name: 'delete',
            aliases: ['del'],
            category: 'Staff',
            description: 'Supprimer un bot de la liste.',
            usage: 'delete <id> <raison>',
            cooldown: 120,
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ManageRoles", "KickMembers"],
            perms: ["Administrator"],
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        const getBot = await bots.findOne({ botId: args[0], verified: true });
        const member = message.guild?.members.cache.get(args[0]);
        if (!getBot || !member) return message.reply({ content: `**${client.emotes.no} ➜ Le bot ${member?.user.tag} ne peut pas être supprimé car il n'est pas vérifié ou n'est pas sur la liste !**` });

        const channel = message.guild?.channels.cache.get(channels.botslogs);
        if (channel?.type !== ChannelType.GuildText) return message.reply({ content: `**${client.emotes.no} ➜ Le salon de logs n'est pas un salon textuel !**` });

        const reason = args.slice(1).join(" ");
        if (!reason) return message.reply({ content: `**${client.emotes.no} ➜ Vous devez préciser une raison de suppresion !**` });

        await bots.deleteOne({ botId: args[0] });

        if (client.config.autokick === true) member.kick().catch(() => {});

        channel.send({
            content: `<@${getBot.ownerId}>`,
            embeds: [
                {
                    title: `Suppression ...`,
                    color: 0xFF0000,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `Vous pensez que c'est une erreur ? Envoyez-moi un Message Privé !`
                    },
                    description: `<@${message.author.id}> vient juste de supprimer le bot ${member.user.username} pour la raison suivante :\n\`\`\`${reason}\`\`\``,
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    }
                }
            ]
        });

        message.channel.send({ content: `${client.emotes.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être supprimé pour la raison suivante :\n\`\`\`${reason}\`\`\`` });

        const ownerBots = await bots.find({ ownerId: getBot.ownerId });
        if (ownerBots.length === 0) {
            const owner = message.guild?.members.cache.get(`${getBot?.ownerId}`);
            if (owner) owner.roles.remove(roles.isclient);
        }
    }
}

export = new Delete;