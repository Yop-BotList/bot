import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";

class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            category: 'Utilitaire',
            description: 'Recevoir la latence du bot.',
            aliases: ['latence']
        });
    }

    async run(client: Class, message: Message) {
        message.reply(`Pong :ping_pong: \nMessage: \`${Date.now() - message.createdTimestamp} ms\`\nBot: \`${client.ws.ping} ms\``);
    }
}

export = new Ping;