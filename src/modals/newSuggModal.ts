import {CommandInteraction, ModalSubmitInteraction, ChannelType, Message, TextChannel} from "discord.js";
import Class from "../index";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";
import {channels} from "../configs";
import {suggests} from "../models";

export default class newSuggModal extends Modal {
    constructor() {
        super({
            title: "Nouvelle suggestion",
            customId: "newSuggModal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "sugg",
                            required: true,
                            label: "Contenu de votre suggestion.",
                            style: 1,
                            placeholder: "Faire un tournois de développement !"
                        })
                    ]
                }
            ]
        });
    }

    async handleSubmit(client: Class, interaction: CommandInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "newSuggModal"
        }).then(async (modal: ModalSubmitInteraction) => {
            const value  = modal.fields.getTextInputValue("sugg")

            const suggestsList = await suggests.find();

            if (!value) return modal.reply({
                content: `✅ ➜ Opération **annulée**.`,
                ephemeral: true
            });

            const channel = await client.channels.fetch(channels.suggests) as TextChannel;

            if (!channel) return modal.reply({
                content: `${client.emotes.no} ➜ Le salon de suggestions n'a pas été trouvé.`,
                ephemeral: true
            })

            channel.send({
                embeds: [
                    {
                        title: `Nouvelle suggestion de ${interaction.user.username} ! (N°${suggestsList.length + 1})`,
                        thumbnail: {
                            url: interaction.guild!.iconURL()!,
                        },
                        color: client.config.color.integer,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `YopBot V${client.version}`
                        },
                        description: `\`\`\`md\n# ${value}\n\`\`\`\n**Votez :**\n👍 = Oui\n🤷 = Pourquoi pas ?\n👎 = Non`,
                        fields: [
                            {
                                name: "Votes",
                                value: `Pour - 50% ${client.emotes.loadBar.blue.start}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.blue.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.middle}${client.emotes.loadBar.red.end} 50% - Contre`
                            }
                        ]
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                custom_id: "forSugg",
                                emoji: {
                                    name: "👍"
                                }
                            }, {
                                type: 2,
                                style: 2,
                                custom_id: "bofSugg",
                                emoji: {
                                    name: "🤷"
                                }
                            }, {
                                type: 2,
                                style: 4,
                                custom_id: "againstSugg",
                                emoji: {
                                    name: "👎"
                                }
                            },
                        ]
                    },
                    {
                        type: 1,
                        components: [
                                {
                                    type: 2,
                                    style: 1,
                                    custom_id: "viewVotersSugg",
                                    emoji: { name: "👀" },
                                    label: "Votes"
                                },
                                {
                                    type: 2,
                                    style: 2,
                                    custom_id: "openThread",
                                    emoji: { name: "hierarchie", id: "907996994595848192" },
                                    label: "Ouvrir un fil",
                                }
                            ]
                    }
                ]
            })
                .then(async (msg: Message) => {
                    await new suggests({
                        id: suggestsList.length + 1,
                        userId: interaction.user.id,
                        msgId: msg.id,
                        moderated: false,
                        for: 0,
                        against: 0,
                        voted: [],
                        content: value
                    }).save();

                    return modal.reply({
                        content: `${client.emotes.yes} ➜ Votre suggestion a bien été envoyée.`,
                        ephemeral: true
                    });
                })
        }).catch(() => {});
    }

}