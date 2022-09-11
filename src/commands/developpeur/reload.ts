import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";

class Reload extends Command {
    constructor() {
        super({
            name: 'reload',
            category: 'Developpeur',
            description: 'Recharger une commande, un évènement, une commande slash ou le bot.',
            aliases: ['rl'],
            usage: 'reload <event | command | slash | bot> [value | ALL]',
            example: ["reload command botadd"],
            minArgs: 1
        });
    }
    
    async run(client: Class, message: Message, args: string[]) {
        if (!['e', 'event', 'c', 'cmd', 'command', 's', 'slash', 'b', 'bot', 'yop', 'yopbot'].includes(args[0])) return message.reply({
            content: `**${client.emotes.no} ➜ Désolé, mais je n’ai pas compris votre demande.**`
        });
        
        if (['e', 'event'].includes(args[0])) args[1] === 'ALL' ? client.reloadAllEvents().then(async (res: string) => await message.reply({ content: res })) : client.reloadEvent(args[1]).then(async (res: string) => await message.reply({ content: res }));
        
        if (['c', 'command', 'cmd'].includes(args[0])) args[1] === 'ALL' ? client.reloadAllCommands().then(async (res: string) => await message.reply({ content: res })) : client.reloadCommand(args[1]).then(async (res: string) => await message.reply({ content: res }));
        
        if (['s', 'slash'].includes(args[0])) args[1] === 'ALL' ? client.reloadAllSlashCommands().then(async (res: string) => await message.reply({ content: res })) : client.reloadSlashCommand(args[1]).then(async (res: string) => await message.reply({ content: res }));
        
        if (['b', 'bot', 'yop', 'yopbot'].includes(args[0])) {
            message.reply({
                content: `**${client.emotes.loading} ➜ Redémarrage dans 5 secondes...**`
            }).then(() => setTimeout(() => {
                client.destroy()
                process.exit(0)
            }, 5000));
        }
    }
}

export = new Reload;