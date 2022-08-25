import { Message } from "discord.js";
import Class from "../..";
import { bots } from "../../models";
import Command from "../../utils/Command";

class Waiting extends Command {
    constructor() {
        super({
            name: 'waiting',
            category: 'Staff',
            description: 'Recevoir un liste de tous les robots en attente de vérification sur le serveur.',
            cooldown: 5
        })
    }
    
    async run(client: Class, message: Message): Promise <Message <boolean> | undefined> {
        const data = await bots.find({ verified: false });
        
        if (!data || data.length <= 0) return message.reply({
            content: `**🎉 ➜ Félicitations, tous les robots en attente sont vérifiés !**`
        });
        
        message.reply({
            embeds: [
                {
                    title: 'Liste des robots en attente de vérification:',
                    color: client.config.color.integer,
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: `${message.guild!.iconURL()}`
                    },
                    footer: {
                        text: 'YopBot V' + client.version
                    },
                    description: data.map(x => `- [${client.users.cache.get(`${x.botId}`)?.tag || x.botId}](https://discord.com/oauth2/authorize?client_id=${x.botId}&permissions=0&scope=bot%20applications.commands)`).join(",\n")
                }
            ]
        });
    }
}

export = new Waiting;