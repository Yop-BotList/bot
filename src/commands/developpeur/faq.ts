import { Message } from "discord.js";
import Command from "../../utils/Command";
import Class from "../..";

class Faq extends Command {
    constructor() {
        super({
            name: "faq",
            category: "Developpeur",
            cooldown: 5,
            description: "Show a modal",
            owner: true
        }); 
    }
    
    async run(client: Class, message: Message) {
        message.channel.send({
            content: "Merci de cliquer sur le bouton ci dessous pour valider votre lecture de la FAQ.",
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2, 
                            style: 3,
                            label: 'Vérification FAQ',
                            custom_id: 'faqVerifBtn'
                        }
                    ]
                }
            ]
        })
    }
}

export = new Faq;