import { Message } from "discord.js";
import Class from "../..";
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
        const member = message.guild?.members.cache.get(getBot?.botId);
        if (!getBot) return message.reply({ content: `**${client.emotes.no} ➜ Le bot ${member?.user.tag} ne peut pas être supprimé car il n'est pas vérifié !**` });
    }
}

export = new Delete;