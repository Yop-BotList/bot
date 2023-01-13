import {ButtonInteraction, GuildMember, ModalSubmitInteraction} from "discord.js";
import Class from "..";
import {config, channels} from "../configs";
import {bots, users} from "../models";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";
import {newInfraction} from "../utils/InfractionService";

export default class RejectBotModal extends Modal {
    constructor() {
        super({
            title: "Reject Bot",
            customId: "rejectbot_modal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "reason_reject",
                            placeholder: "Parce qu'il n'a pas assez de commandes utils.",
                            required: true,
                            label: "Pour quel raison vous refuser ce robot ?",
                            minLength: 5,
                            style: 1
                        })
                    ]
                }
            ]
        });
    }

    async handleSubmit(client: Class, interaction: ButtonInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "rejectbot_modal"
        }).then(async (modal: ModalSubmitInteraction) => {
            const reason = modal.fields.getTextInputValue("reason_reject");

            if (!reason) return modal.reply("Merci de répondre entierrement au modal.");

            const adb = await bots.findOne({msgID: interaction.message.id})
            if (adb) {
                const member = await client.users.fetch(adb.botId).catch(error => {
                })
                if (!member) return interaction.reply({
                    content: `Impossible de refuser ce robot, il n'est peut être plus dans la liste ou alors le robot a été supprimé.`,
                    ephemeral: true
                })
                let owner = await interaction.guild!.members.fetch(adb.ownerId)
// @ts-ignore
                interaction.guild.channels.cache.get(interaction.channel.id).messages.fetch(interaction.message.id).then(async (msg: any) => {
                         msg.edit({components: []})

                    modal.reply({
                        // @ts-ignore
                        content: `<@${adb.ownerId}>`, embeds: [
                            {
                                title: "Refus...",
                                timestamp: new Date().toISOString(),
                                thumbnail: {
                                    url: member.displayAvatarURL()
                                },
                                color: 0xff0000,
                                footer: {
                                    text: `Tu peux toujours corriger ce que ${interaction.user.username} demande et refaire une demande ^^`
                                },
                                description: `${interaction.user} vient juste de refuser le bot ${member.username} pour la raison suivante : \`\`\`\n${reason}\n\`\`\``
                            }
                        ]
                    })
                })
                await newInfraction(client, owner.user, <GuildMember>interaction.member!, interaction.guild!, "WARN", "Non respect des conditions d'ajout de bots.", 0)
                       await bots.findOneAndDelete({ botId: adb.botId})
            }
        });
    }
}