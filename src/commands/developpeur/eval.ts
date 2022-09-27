import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";

class Eval extends Command {
    constructor() {
        super({
            name: "eval",
            category: "Developpeur",
            description: "Test un code.",
            usage: "eval <code>",
            example: ["eval console.log('Hello World')"],
            aliases: ["e"],
            cooldown: 5,
            owner: true,
            minArgs: 1
        });
    }

    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        let code = args.join(" ");
        let result = "";

        try {
            result = await eval(code);
        } catch (error: any) {
            result = await error.message;
        }

        if (code.length > 1024) code = code.substring(0, 1021) + "...";
        if (result.length > 1024) result = result.substring(0, 1021) + "...";

        if (code.toLowerCase().includes('token') || result.includes(client.config.token) || code.toLowerCase().includes("token")) return message.reply(`**${client.emotes.no} ➜ Vous ne pouvez pas utiliser le token du bot.**`);
        if (code.toLowerCase().includes("client.destroy()")) return message.reply(`**${client.emotes.no} ➜ Vous ne pouvez pas utiliser la commande \`client.destroy()\`.**`);
        if (code.toLowerCase().includes("roles.remove") || code.toLowerCase().includes("roles.add")) return message.reply(`**${client.emotes.no} ➜ Vous ne pouvez pas utiliser les commandes \`roles.remove\` et \`roles.add\`.**`);
        if (code.toLowerCase().includes(client.config.mongooseConnectionString) || result.includes(client.config.mongooseConnectionString) || code.toLowerCase().includes("mongooseConnectionString") ) return message.reply(`**${client.emotes.no} ➜ Vous ne pouvez pas utiliser l'url de connexion de mongodb.**`);

        message.reply({
            content: null,
            embeds: [
                {
                    title: "Évaluation d'un code en Javascript :",
                    color: client.config.color.integer,
                    thumbnail: {
                        url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    fields: [
                        {
                            name: "➜ Entrée :",
                            value: "```js\n" + code + "```"
                        }, {
                            name: "➜ Sortie :",
                            value: "```js\n" + result + "```"
                        }
                    ]
                }
            ]
        });
    }
}

export = new Eval;
