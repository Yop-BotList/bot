import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";

class Eval extends Command {
    constructor() {
        super({
            name: "eval",
            category: "owner",
            description: "Test un code.",
            usage: "eval <code>",
            example: ["eval console.log('Hello World')"],
            aliases: ["e"],
            cooldown: 5,
            owner: true
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        message.reply({
            content: "Test passé avec succès !"
        });
    }
}

export = new Eval;