import { Message, PermissionResolvable, TextChannel } from "discord.js";
import Class from "..";
import onCooldown from "./onCooldown";
import moment from "moment"

export default function execCommand(command: any, client: Class, message: Message, args: string[]): Promise<Message<boolean>> | undefined {
    const channel = message.channel as TextChannel;
    if (channel.name.startsWith("🎫・ticket-")) return;
    if (command.owner === true) {
        if (!client.config.owners.includes(message.author.id)) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cette commande.**` });
    }

    if (command.perms.length !== 0) {
        let perms = [];
        for (let i = 0; i < command.perms.length; i++) {
            if (!message.member?.permissions.has(command.perms[i] as PermissionResolvable)) perms.push(command.perms[i]);
        }

        if (perms.length > 0) return message.reply({ content: `**${client.emotes.no} ➜ Il vous manque les permissions : \`${perms.join("`,\n`")}\`**` });
    }
    
    if (command.botPerms.length !== 0) {
        let botPerms = []
        for(let i = 0;i < command.botPerms.length; i++) {
            if(!message.guild?.members.me!.permissions.has(command.botPerms[i])) botPerms.push(`\`${command.botPerms[i]}\``);
        }

        if(botPerms.length > 0) return message.reply(`**${client.emotes.no} ➜ Il me manque les permissions suivantes pour pouvoir exécuter cette commande** : \`${botPerms.join("`,\n`")}\``);
    }

    if (command.disabled) return message.reply({ content: `**${client.emotes.no} ➜ Cette commande est actuellement désactivée.**` });

    if (command.requiredRole !== "") {
        if (!message.member?.roles.cache.has(command.requiredRole)) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas le rôle requis pour utiliser cette commande.**` });
    }

    if (onCooldown(client, message, command) && !client.config.owners.includes(message.author.id)) return message.reply({ content: `**${client.emotes.no} ➜ Veuillez patienter encore ${onCooldown(client, message, command)} avant de pouvoir réutiliser la commande \`${command.name}\` !**` });

    if (command.minArgs > 0 && args.length < command.minArgs) return message.reply({ content: `**${client.emotes.no} ➜ \`${command.usage}\`**` });

    try {
        command.run(client, message, args);
    } catch (error: any) {
        client.emit('error', error);
        message.reply({
            embeds: [
                {
                    title: 'Une erreur est survenue',
                    description: '```js\n' + error + '```',
                    footer: {
                        text: moment(Date.now()).format('DD_MM_YYYY_kk_mm_ss_ms')
                    }
                }
            ]
        });
    }
}
