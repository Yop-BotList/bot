import {ChannelType, ModalSubmitInteraction, SelectMenuInteraction, User} from "discord.js";
import Class from "..";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";
import {channels} from "../configs";
import { users } from "../models"

export default class EditInfractionReasonModal extends Modal {
    transfer: {
        id: number,
        userId: string,
        modId: string,
        type: string,
        reason: string,
        duration: number | null,
        finishOn: number | null,
        date: number,
        deleted: boolean,
        historyLogs: [
            {
                title: string,
                mod: string,
                date: number
            }
        ]
    };
    user: User;

    constructor(transfer: {
        id: number,
        userId: string,
        modId: string,
        type: string,
        reason: string,
        duration: number | null,
        finishOn: number | null,
        date: number,
        deleted: boolean,
        historyLogs: [
            {
                title: string,
                mod: string,
                date: number
            }
        ]
    }, user: User) {
        super({
            title: "Modifier la raison",
            customId: "editinfractionmodal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "reason",
                            placeholder: "Insultes envers l'un des membres du STAFF.",
                            required: true,
                            label: "Nouvelle raison de la sanction ?",
                            style: 2
                        })
                    ]
                }
            ]
        });

        this.transfer = transfer;
        this.user = user;
    }


    async handleSubmit(client: Class, interaction: SelectMenuInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "editinfractionmodal"
        }).then(async (modal: ModalSubmitInteraction) => {
            let reason = modal.fields.getTextInputValue("reason");

            if (!reason) return modal.reply({
                content: `**${client.emotes.no} ➜ Merci de répondre correctement au modal.**`,
                ephemeral: true
            });

            this.transfer.historyLogs.push({
                title: "Modification de la raison.",
                mod: interaction.user.id,
                date: Date.now()
            })

            const channel = client.channels.cache.get(channels.modlogs)

            if (channel && channel.type === ChannelType.GuildText) {
                let fields = [
                    {
                        name: `${client.emotes.discordicons.man} ➜ Utilisateur :`,
                        value: "```md\n# " + this.user.tag + " (" + this.user.id + ")" + "```",
                        inline: false
                    },
                    {
                        name: `${client.emotes.badges.staff} ➜ Modérateur :`,
                        value: "```md\n# " + interaction.user.tag + " (" + interaction.id + ")" + "```",
                        inline: false
                    },
                    {
                        name: `${client.emotes.badges.mod} ➜ Avant :`,
                        value: "```md\n# " + this.transfer.reason + "```",
                        inline: false
                    },
                    {
                        name: `${client.emotes.badges.mod} ➜ Avant :`,
                        value: "```md\n# " + reason + "```",
                        inline: false
                    }
                ];

                let embed = {
                    title: 'Modification de la raison',
                    color: client.config.color.integer,
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: this.user.displayAvatarURL()
                    },
                    fields: fields
                }

                this.user.send({ embeds: [embed] }).catch(async() => fields.push({
                    name: `:warning: ➜ Avertissement`,
                    value: "```md\n# Je n'ai pas pu prévenir " + this.user.tag + " de sa sanction.```",
                    inline: false
                }));

                embed = {
                    title: 'Modification de la raison',
                    color: client.config.color.integer,
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: this.user.displayAvatarURL()
                    },
                    fields: fields
                }

                channel.send({
                    embeds: [
                        embed
                    ]
                })
            }

            this.transfer.reason = reason

            let data = await users.findOne({ userId: this.user.id })
            let warns = data!.warns.filter((warn: any) => warn.id !== this.transfer.id)
            warns.push(this.transfer)
            data!.warns = warns
            data!.save()

            modal.reply({
                content: `**${client.emotes.yes} ➜ Raison modifiée.**`
            })
        });
    }
}