import { Message } from "discord.js";
import Class from "../..";
import { roles } from "../../configs";
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
        if (args[0] === "set") {}
        if (args[0] === "reset") {}
    }
}

export = new Likes;