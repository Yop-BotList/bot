import {ChannelType, ModalSubmitInteraction, SelectMenuInteraction, User} from "discord.js";
import Class from "..";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";
import {channels} from "../configs";
import { users } from "../models"
import prettyMilliseconds from "pretty-ms";
import ms from "ms";

export default class EditInfractionDurationModal extends Modal {
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
            title: "Modifier la durée",
            customId: "editdurationmodal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "duration",
                            placeholder: "5d",
                            required: true,
                            label: "Nouvelle durée de la sanction ?",
                            style: 1
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
            filter: (modal: ModalSubmitInteraction) => modal.customId === "editdurationmodal"
        }).then(async (modal: ModalSubmitInteraction) => {
            let duration = modal.fields.getTextInputValue("duration");

            if (!duration) return modal.reply({
                content: `**${client.emotes.no} ➜ Merci de répondre correctement au modal.**`,
                ephemeral: true
            });

            if (!ms(duration) || this.transfer.date + ms(duration) <= Date.now()) return modal.reply({
                content: `**${client.emotes.no} ➜ Durée invalide ou moment où l'infraction (après modification) se termine antérieur à l'instant présent.**`,
                ephemeral: true
            });

            this.transfer.historyLogs.push({
                title: `Modification de la durée (avant : ${prettyMilliseconds(this.transfer.duration || 0, { compact: true })}).`,
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
                        value: "```md\n# " + this.transfer.duration + "```",
                        inline: false
                    },
                    {
                        name: `${client.emotes.badges.mod} ➜ Après :`,
                        value: "```md\n# " + duration + "```",
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
                    value: "```md\n# Je n'ai pas pu prévenir " + this.user.tag + " de la modification de sa sanction.```",
                    inline: false
                }));

                embed = {
                    title: 'Modification de la durée',
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

            this.transfer.duration = ms(duration)
            this.transfer.finishOn = this.transfer.date + ms(duration)

            let data = await users.findOne({ userId: this.user.id })
            let warns = data!.warns.filter((warn: any) => warn.id !== this.transfer.id)
            warns.push(this.transfer)
            data!.warns = warns
            data!.save()

            modal.reply({
                content: `**${client.emotes.yes} ➜ Durée modifiée.**`
            })
        });
    }
}