import { ButtonInteraction, Interaction, ModalSubmitInteraction } from "discord.js";
import { config } from "../configs";
import { users } from "../models";
import Modal from "./Modal";
import TextInput from "./TextInput";

export default class FaqModal extends Modal {
    constructor() {
        super({
            title: "Faq Modal", 
            customId: "faq_modal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "faq1",
                            placeholder: "Que faut t'il de visible dans une des commandes du bot (choix au dessus) ?",
                            required: true,
                            label: "OWNER_MENTION, BOT_PREFIX, USERNAME+TAG",
                            maxLength: 13,
                            minLength: 10,
                            style: 1
                        })
                    ]
                }, {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "faq2",
                            placeholder: "Status du bot nécessaire a la vérification du bot (choix au dessus)",
                            required: true,
                            label: "ONLINE, OFFLINE",
                            maxLength: 7,
                            minLength: 6,
                            style: 1
                        })
                    ]
                }
            ]
        });
    }

    async handleSubmit(interaction: ButtonInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "faq_modal"
        }).then(async (modal: ModalSubmitInteraction) => {
            const choseNecessaire = modal.fields.getTextInputValue("faq1");
            const botStatus = modal.fields.getTextInputValue("faq2");

            if (!choseNecessaire || !botStatus) return modal.reply("Merci de répondre entierrement au modal.");

            let errors = 0;

            if (choseNecessaire !== "USERNAME+TAG") errors += 1;
            if (botStatus !== "ONLINE") errors += 1;

            if (errors > 0) return modal.reply({
                content: "Vous avez fait trop d'erreurs merci de relire correctement la faq et reéssayer.",
                ephemeral: true
            });

            const userGet = await users.findOne({ userId: modal.user.id });
            userGet!.readFaq = true;
            userGet!.save();

            modal.reply({
                content: `Vous pouvez maintenant ajouter des bots sur le serveur via la commande \`${config.prefix}botadd\`.`,
                ephemeral: true
            });
        });
    }
}