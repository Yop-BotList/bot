import { Message, PermissionResolvable } from "discord.js";
import Class from "..";
import onCooldown from "./onCooldown";

export default function execCommand(command: any, client: Class, message: Message, args: string[]): Promise<Message<boolean>> | undefined {
    if (command.owner === true) {
        if (!client.config.owners.includes(message.author.id)) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cette commande.**` });
    }

    if (command.perms > 0 && !command.perms.some((permission: PermissionResolvable) => message.member?.permissions.has(permission))) return message.reply({ content: `**${client.emotes.no} ➜ Il te manque une de ces permissions \`${command.perms.join("`, `")}\`.**` });
    
    if (command.botPerms !== []) {
        let perms = []
        for(let i = 0;i < command.botPerms.length; i++) {
            if(!message.guild?.me?.permissions.has(command.botPerms[i])) {
                perms.push(`\`${command.botPerms[i]}\``);
            }
        }

        if(perms.length >= 1) return message.reply(`**${client.emotes.no} ➜ Il me manque les permissions suivantes pour pouvoir exécuter cette commande : \`${perms.join("`,\n`")}\``);
    }

    if (onCooldown(client, message, command) && !client.config.owners.includes(message.author.id)) return message.reply({ content: `**${client.emotes.no} ➜ Veuillez patienter encore ${onCooldown(client, message, command)} avant de pouvoir réutiliser la commande \`${command.name}\` !**` });

    if (command.minArgs > 0 && args.length < command.minArgs) return message.reply({ content: `**${client.emotes.no} ➜ \`${command.usage}\`**` });

    try {
        command.run(client, message, args);
    } catch (error: any) {
        client.emit('error', error);
    }
}