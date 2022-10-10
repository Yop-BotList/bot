import { CommandInteraction, ModalSubmitInteraction } from "discord.js";
import Class from "..";
import { bots } from "../models";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";

export default class BotModal extends Modal {
    botId: string;
    type: string;
    oldValue: string;

    constructor(botId: string, type: string, oldValue: string) {
        super({
            title: "Bot Gestion",
            customId: "bot_gestion",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "value",
                            required: true,
                            label: "Nouvelle valeur, new value.",
                            style: 1,
                            value: oldValue,
                            placeholder: "/"
                        })
                    ]
                }
            ]
        });

        this.botId = botId;
        this.type = type;
        this.oldValue = oldValue
    }

    async handleSubmit(client: Class, interaction: CommandInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "bot_gestion"
        }).then(async (modal: ModalSubmitInteraction) => {
            const value = modal.fields.getTextInputValue("value");

            if (!value) return modal.reply({
                content: `**${client.emotes.no} ➜ Merci de répondre entierrement au modal.**`,
                ephemeral: true
            });

            const botData = await bots.findOne({ botId: this.botId });

            if (!botData) return modal.reply({
                content: `**${client.emotes.no} ➜ Ce bot n'existe pas dans la base de données.**`,
                ephemeral: true
            });

            if (value === this.oldValue) return modal.reply({
                content: `**${client.emotes.no} ➜ Vous n'avez pas changé la valeur.**`
            });

            if (this.type === "description") botData.description = value;
            if (this.type === "prefix") botData.prefix = value;
            if (this.type === "site") botData.site = value;
            if (this.type === "supportInvite") botData.supportInvite = value;

            botData.save();

            modal.reply({
                content: `**${client.emotes.yes} ➜ Valeur changée avec succès !**`
            });
        }).catch(console.error);
    }
    
}