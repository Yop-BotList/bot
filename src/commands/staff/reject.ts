import { Message } from "discord.js";
import Class from "../..";
import { channels, config, roles } from "../../configs";
import bots from "../../models/bots";
import verificators from "../../models/verificators";
import Command from "../../utils/Command";

class Delete extends Command {
    constructor() {
        super({
            name: 'reject',
            aliases: ['rej'],
            category: 'Staff',
            description: 'Refuser un bot de la liste.',
            usage: 'reject <id> <raison>',
            cooldown: 120,
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ManageRoles", "KickMembers"],
            requiredRole: roles.verificator,
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        if (!args[0]) return message.reply({ content: `**${client.emotes.no} ➜ Merci de me donner un ID de bot valide et présent sur le serveur.**`})
        const member = await message.guild!.members.fetch(args[0]);
        if (!member) return message.reply({ content: `**${client.emotes.no} ➜ Merci de me donner un ID de bot valide et présent sur le serveur.**`})
        let botGet = await bots.findOne({ botId: args[0], verified: false });
        if (!botGet) return message.reply({ content: `**${client.emotes.no} ➜ Aucune demande n’a été envoyée pour ${member?.user.tag} !**` });

        if (!args.slice(1).join(" ")) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas donné de raison de refus.**` });
        
        const channel = client.channels.cache!.get(channels.botslogs);
        
        channel?.isTextBased() ? channel.send({
            content: `<@${botGet.ownerId}>`,
            embeds: [
                {
                    title: "Refus...",
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: member?.user.displayAvatarURL()
                    },
                    color: client.config.color.integer,
                    footer: {
                        text: `Tu peux toujours corriger ce que ${message.author.username} demande et refaire une demande ^^`
                    },
                    description: `<@${message.author.id}> vient juste de refuser le bot ${member?.user.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
                }
            ]
        }) : new Error("The channel is not a Text Based channel");

        const verificator = await verificators.findOne({ userId: message.author.id })
        if (verificator) {
            verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
            verificator.save();
        }
        if (!verificator) new verificators({
            userId: message.author.id,
            verifications: 1
        }).save()

        message.channel.send({
            content: `**${client.emotes.yes} ➜ Le bot ${member?.user.username}#${member?.user.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\`**`
        });

        await bots.deleteOne({ botID: args[0] });

        if (config.autokick === true) member?.kick();
    }
}

export = new Delete;