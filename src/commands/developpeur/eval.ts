import { Message } from "discord.js";
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

    async run(message: Message, args: string[]) {}
}

export = new Eval;