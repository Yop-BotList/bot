import {ModalSubmitInteraction, SelectMenuInteraction, User} from "discord.js";
import Class from "..";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";

export default class EditInfractionReasonModal extends Modal {
    data: {
        id: number,
        userId: string,
        modId: string,
        type: string,
        reason: string,
        duration: number | null,
        finishOn: number | null,
        date: Date,
        deleted: boolean,
        historyLogs: [
            {
                title: string,
                mod: string,
                date: Date
            }
        ]
    };
    user: User;

    constructor(data: {
        id: number,
        userId: string,
        modId: string,
        type: string,
        reason: string,
        duration: number | null,
        finishOn: number | null,
        date: Date,
        deleted: boolean,
        historyLogs: [
            {
                title: string,
                mod: string,
                date: Date
            }
        ]
    }, user: User) {
        super({
            title: "EditInfractionModal",
            customId: "EditInfractionModal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "reason",
                            placeholder: "Insultes envers l'un des membres du STAFF.",
                            required: true,
                            label: "Quelle est la nouvelle raison de la sanction ?",
                            style: 2
                        })
                    ]
                }
            ]
        });

        this.data = data;
        this.user = user;
    }


    async handleSubmit(client: Class, interaction: SelectMenuInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "EditInfractionModal"
        }).then(async (modal: ModalSubmitInteraction) => {
            let reason = modal.fields.getTextInputValue("reason");

            if (!reason) return modal.reply({
                content: `**${client.emotes.no} ➜ Merci de répondre correctement au modal.**`,
                ephemeral: true
            });
        });
    }
}