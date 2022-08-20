import { ChannelType, Message } from "discord.js";
import Class from "..";
import { channels } from "../configs";
import execCommand from "../functions/execCommand";
import user from "../models/user";

export = async (client: Class, message: Message) => {
    if (message.author.bot) return;
    
    if (message.channel.type === ChannelType.DM) return;
    // funny system
    if (message.content === `<@${client.user?.id}>`) {
        if (client.config.owners.includes(message.author.id)) return message.reply(`**${client.emotes.discordicons.wave} ➜ Bonjour maître ! Comment allez-vous ?**`);
        else return message.reply(`**${client.emotes.discordicons.wave} ➜ Bonjour, suis YopBot ! Mon préfixe est \`${client.config.prefix}\` mais sinon, vous pouvez utiliser mes commandes slash !**`);
    }
    
    if (message.content.includes(`${client.user?.username}`)) message.react("👀");

    /* Command System */
    
    if (!message.content.startsWith(client.config.prefix)) return;
    
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const cmdName = args.shift()?.toLowerCase();
    const command = client.commands.find(cmd => (cmd.name === cmdName) || cmd.aliases.includes(cmdName));

    if (!command) return;

    let db = await user.findOne({ userID: message.author.id, cmdbl: true });
    if (db) return message.reply({ content: `**${client.emotes.no} ➜ Vous êtes sur la liste noire des commandes. Vous ne pouvez donc pas en utiliser.**` });

    const channel = client.channels.cache?.get(channels.botlogs);
    if (channel?.type !== ChannelType.GuildText) return;
    channel.send({
        content: null,
        embeds: [
            {
                title: "Utilisation d'un commande",
                thumbnail: {
                    url: message.author.displayAvatarURL()
                },
                color: client.config.color.integer,
                timestamp: new Date().toISOString(),
                fields: [
                    {
                        name: "➜ Utilisateur :",
                        value: `\`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\``
                    }, {
                        name: "➜ Commande :",
                        value: "```" + message.content + "```"
                    }, {
                        name: "➜ Lien",
                        value: `[Cliquez-ici](https://discord.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}) _Il se peut que cette personne aie supprimé ou édité son message._`
                    }
                ]
            }
        ]
    });

    execCommand(command, client, message, args);
}