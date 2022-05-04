import Command from "../../utils/Command";

class Eval extends Command {
    constructor() {
        super({
            name: "eval",
            category: "owner",
            description: "Test un code.",
            usage: "eval <code>",
            example: ["eval 1 + 1"],
            aliases: ["e"],
            cooldown: 5,
        });
    }
}