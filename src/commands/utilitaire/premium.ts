import { Message } from "discord.js";
import Class from "../..";
import { roles } from "../../configs";
import Command from "../../utils/Command";

class Premium extends Command {
    constructor() {
        super({
            name: 'premium',
            category: 'Utilitaire',
            description: `Voir des informations sur le rôle <@&${roles.premium}>`,
            cooldown: 5
        });
    }

    async run(client: Class, message: Message) {
        message.reply({
            embeds: [
                {
                    title: "Grade Premium...",
                    color: client.config.color.integer,
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: `${message.guild?.iconURL()}`
                    },
                    fields: [
                        {
                            name: "➜ Obtention :",
                            value: `Le grade <@&${roles.premium}> ne peut pas être obtenu gratuitement.\n Pour l'obtenir, vous devez le gagner lors d'un giveaway. Si vous êtes l'un de nos <@&784745567032573973> ou <@&828572424211398716> *(voir <#828531510772367391>)*, vous bénéfieciez aussi des avantages !`
                        }, {
                            name: "➜ Avantages :",
                            value: `• 2 bots.\n• Ajout d’un salon d’annonces dans le <#783013505225719829> *(seulement pour les 10 premiers)*.\n• Le grade <@&${roles.premiumbot}> pour tout vos bots.\n• La possibilité de changer son pseudo.\n• La possibilité de créer des threads dans certains salons.`
                        }
                    ]
                }
            ]
        });
    }
}

export = new Premium;