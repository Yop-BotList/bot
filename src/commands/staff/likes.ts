import { Message } from "discord.js";
import Class from "../..";
import { roles } from "../../configs";
import { bots } from "../../models";
import Command from "../../utils/Command";

class Likes extends Command {
    constructor() {
        super({
            name: "likes",
            category: "Staff",
            description: "Permet de changer ou mettre à zero le nombre de likes d'un bot.",
            usage: "likes <set/reset> <bot_id> [nombre]",
            requiredRole: roles.verificator,
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        if (args[0] === "set") {
            const user = client.users.cache.get(args[1]);

            if (!user) return message.reply(`**${client.emotes.no} ➜ Merci de donner un identifiant correct pour que je puisse trouver ce bot**`);
            if (!user.bot) return message.reply(`**${client.emotes.no} ➜ Cet utilisateur n'est pas uun robot.**`);

            if (!args[2]) return message.reply(`**${client.emotes.no} ➜ Vous n'avez pas précisé le nombre de like à mettre.**`);

            const likeCount = Number(args[2]);

            if (isNaN(likeCount)) return message.reply(`**${client.emotes.no} ➜ ${args[2]} n'est pas un nombre.**`);

            const getBot = await bots.findOne({ botId: args[1] });

            if (!getBot) return message.reply(`**${client.emotes.no} ➜ \`${user.tag}\` n'est pas dans la base de données.**`);

            getBot.likes = likeCount;
            getBot.save();

            message.reply(`**${client.emotes.yes} ➜ \`${user.tag}\` a désormé ${likeCount} likes.**`);
        }
        if (args[0] === "reset") {
            const user = client.users.cache.get(args[1]);

            if (!user) return message.reply(`**${client.emotes.no} ➜ Merci de donner un identifiant correct pour que je puisse trouver ce bot**`);
            if (!user.bot) return message.reply(`**${client.emotes.no} ➜ Cet utilisateur n'est pas uun robot.**`);

          //  if (!args[2]) return message.reply(`**${client.emotes.no} ➜ Vous n'avez pas précisé le nombre de like à mettre.**`);

            const getBot = await bots.findOne({ botId: args[1] });

            if (!getBot) return message.reply(`**${client.emotes.no} ➜ \`${user.tag}\` n'est pas dans la base de données.**`);

            getBot.likes = 0;
            getBot.save();

            message.reply(`**${client.emotes.yes} ➜ \`${user.tag}\` a désormé 0 like.**`);
        }
    }
}

export = new Likes;
