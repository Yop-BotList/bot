import {ChatInputCommandInteraction, CommandInteraction, ModalSubmitInteraction, User} from "discord.js";
import Class from "..";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";
import {bots} from "../models";
import {channels} from "../configs";

export default class EditDescModal extends Modal {
    botId: string
    constructor(botId: string) {
        super({
            title: "Modifier la description.",
            customId: "editdescmodal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "desc",
                            placeholder: "Robot super performant permettant de protéger votre serveur contre les raids :)",
                            required: true,
                            label: "Description :",
                            style: 2
                        })
                    ]
                }
            ]
        });
        this.botId = botId
    }


    async handleSubmit(client: Class, interaction: ChatInputCommandInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "editdescmodal"
        }).then(async (modal: ModalSubmitInteraction) => {
            let desc = modal.fields.getTextInputValue("desc");

            if (!desc) return modal.reply({
                content: `**${client.emotes.no} ➜ Merci de répondre correctement au modal.**`,
                ephemeral: true
            });

            if (desc.length > 200) return modal.reply({
                content: `**${client.emotes.no} ➜ La description ne peut pas dépasser 200 caractères.**`,
                ephemeral: true
            })

            let bot = await bots.findOne({ botId: this.botId });

            if (!bot) return modal.reply({
                content: `**${client.emotes.no} ➜ Une erreur interne est survenue. Veuillez réessayer.**`,
                ephemeral: true
            })

            let oldDesc = bot.description;

            bot.description = desc;
            bot.save()

            let botUser = await client.users.fetch(this.botId).catch(() => {}) as User;

            const channel = client.channels.cache.get(channels.botslogs);
            channel?.isTextBased() ? channel.send({ content: `<@${bot.ownerId}>${bot.team!.length > 0 ? `, ${bot.team!.map((x: string) => `<@${x}>`).join(", ")}` : ""}`, embeds: [
                        {
                            color: client.config.color.integer,
                            title: "Modification du profil...",
                            thumbnail: {
                                url: botUser.displayAvatarURL()
                            },
                            timestamp: new Date().toISOString(),
                            description: `<@${interaction.user.id}> vient juste d'éditer la description de votre robot <@${botUser.id}> :`,
                            fields: [
                                {
                                    name: "➜ Avant :",
                                    value: `\`\`\`${oldDesc}\`\`\``,
                                    inline: false
                                }, {
                                    name: "➜ Après :",
                                    value: `\`\`\`${bot.description}\`\`\``,
                                    inline: false
                                }
                            ]
                        }
                    ] })
                : new Error(`Channel botlogs: ${channels.botslogs} is not a text based channel.`);

            modal.reply({
                content: `**${client.emotes.yes} ➜ Modifications enregistrées !**`,
                ephemeral: true
            })
        });
    }
}