import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";

class Avatar extends Command {
    constructor() {
        super({
            name: 'avatar',
            category: 'Utilitaire',
            description: 'Voir l\'avatar d\'un autre utilisateur.',
            usage: 'avatar [utilisateur]',
            example: ["avatar <@692374264476860507>"],
            aliases: ['pp']
        });
    }
    
    async run(client: Class, message: Message) {
        let user = message.mentions.users.first() || message.author;
        
        message.reply({
            embeds: [
                {
                    author: {
                        name: `Avatar de : ${user.tag}`,
                        icon_url: user.displayAvatarURL(),
                        url: user.displayAvatarURL()
                    },
                    color: client.config.color.integer,
                    fields: [
                        {
                            name: "➜ PNG",
                            value: `[\`Lien\`](${user.displayAvatarURL({ extension: "png" })})`,
                            inline: true
                        }, {
                            name: "➜ JPEG",
                            value: `[\`Lien\`](${user.displayAvatarURL({ extension: "jpeg" })})`,
                            inline: true
                        }, {
                            name: "➜ WEBP",
                            value: `[\`Lien\`](${user.displayAvatarURL({ extension: "webp" })})`,
                            inline: true
                        }
                    ],
                    image: {
                        url: user.displayAvatarURL()
                    }
                }
            ]
        });
    }
}
                        
export = new Avatar;