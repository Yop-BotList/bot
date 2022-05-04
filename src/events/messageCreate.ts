import { ChannelType, Client, Message } from "discord.js";
import { config, emotes } from "../configs";
import escapeRegex from "../functions/escapeRegex";

module.exports = async (client: Client, message: Message) => {
    if (message.author.bot) return;
    
    if (message.channel.type === ChannelType.DM) return;
    // funny system
    if (message.content === `<@${client.user?.id}>`) {
        if (config.owners.includes(message.author.id)) return message.reply(`**${emotes.discordicons.wave} ➜ Bonjour maître ! Comment allez-vous ?**`);
        else return message.reply(`**${emotes.discordicons.wave} ➜ Bonjour, suis YopBot ! Mon préfixe est \`${config.prefix}\` mais sinon, vous pouvez utiliser mes commandes slash !**`);
    }
    
    if (message.content.includes(`${client.user?.username}`)) message.react("👀");
    
    // commands system
    
    const prefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${escapeRegex(config.prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const matchedPrefix = message.content.match(prefixRegex),
        args = message.content.slice(matchedPrefix?.length).trim().split(/ +/),
        cmd = args.shift()?.toLowerCase();

    if (message.content.includes(`${client.user?.username}`)) message.react("👀");

    if (!message.content.startsWith(config.prefix)) return;
}