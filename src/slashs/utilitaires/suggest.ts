import Slash from "../../utils/Slash";
import {ChatInputCommandInteraction, CommandInteraction, Message, PermissionsBitField, TextChannel} from "discord.js";
import Class from "../../index";
import SendModal from "../../utils/SendModal";
import newSuggModal from "../../modals/newSuggModal";
import {suggests} from "../../models";
import {channels} from "../../configs";

class Suggest extends Slash {
    constructor() {
        super({
            name: "suggestion",
            name_localizations: {
                "en-GB": "suggest"
            },
            description: "Système de suggestions.",
            description_localizations: {
                "en-GB": "Suggests system."
            },
            options: [
                {
                    type: 1,
                    name: "envoyer",
                    nameLocalizations: {
                        "en-GB": "send"
                    },
                    description: "Créer une nouvelle suggestion pour le serveur.",
                    descriptionLocalizations: {
                        "en-GB": "Send new suggest for the server."
                    },
                    options: []
                },
                {
                    type: 1,
                    name: "répondre",
                    nameLocalizations: {
                        "en-GB": "answer"
                    },
                    description: "Répondre à une suggestion.",
                    descriptionLocalizations: {
                        "en-GB": "Answer to a suggest."
                    },
                    options: [
                        {
                            type: 10,
                            name: "identifiant",
                            nameLocalizations: {
                                "en-GB": "id"
                            },
                            description: "Identifiant de la suggestion.",
                            descriptionLocalizations: {
                                "en-GB": "Suggest's ID."
                            },
                            required: true
                        },
                        {
                            type: 3,
                            name: "réponse",
                            nameLocalizations: {
                                "en-GB": "answer"
                            },
                            description: "Réponse à la suggestion.",
                            descriptionLocalizations: {
                                "en-GB": "Answer to the suggestion."
                            },
                            choices: [
                                {
                                    name: "✅ Favorable",
                                    nameLocalizations: {
                                        "en-GB": "✅ Favourable"
                                    },
                                    value: "yes"
                                },
                                {
                                    name: "🤷 Mitigée",
                                    nameLocalizations: {
                                        "en-GB": "🤷 Mixed"
                                    },
                                    value: "bof"
                                },
                                {
                                    name: "❌ Défavorable",
                                    nameLocalizations: {
                                        "en-GB": "❌ Unfavourable"
                                    },
                                    value: "no"
                                },
                            ],
                            required: true
                        },
                        {
                            type: 3,
                            name: "commentaire",
                            nameLocalizations: {
                                "en-GB": "comment"
                            },
                            description: "Ajouter un commentaire à la réponse.",
                            descriptionLocalizations: {
                                "en-GB": "Add a comment to the answer."
                            },
                            max_length: 500,
                            required: false
                        }
                    ]
                },
            ],
        });
    }

    async run(client: Class, interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case 'envoyer': {
                const modal = new newSuggModal();
                SendModal(client, interaction, modal);
                modal.handleSubmit(client, interaction);
                break;
            }
            case 'répondre': {
                // @ts-ignore
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas la permission d'utiliser cette commande !**`, ephemeral: true });

                const id = interaction.options.get('identifiant')?.value as number;
                const answer = interaction.options.get('réponse')?.value as string;
                const comment = interaction.options.get('commentaire')?.value as string | null;

                const suggData = await suggests.findOne({ id: id });

                if (!suggData) return interaction.reply({ content: `**${client.emotes.no} ➜ Suggestion introuvable !**`, ephemeral: true });

                if (suggData.moderated) return interaction.reply({ content: `**${client.emotes.no} ➜ Une réponse a déjà été donnée à cette suggestion.**`, ephemeral: true });

                const suggChannel = client.channels.cache.get(channels.suggests) as TextChannel;

                const sugg = await suggChannel.messages.fetch(suggData.msgId).catch(() => null);

                if (!sugg) return interaction.reply({ content: `**${client.emotes.no} ➜ Suggestion introuvable !**`, ephemeral: true });


                const embed = sugg.embeds[0];


                let forSugg = suggData.for;
                let againstSugg = suggData.against;
                let percentF = 50;
                let percentA = 50;

                function toPercent(votes: number): number {
                    const total = forSugg + againstSugg;

                    const percent = (100 * votes) / total;

                    return isNaN(percent) ? 50 : Math.trunc(percent);
                }


                function drawVoteBar() {
                    percentF = toPercent(forSugg);
                    percentA = toPercent(againstSugg);

                    const blue = client.emotes.loadBar.blue;
                    const red = client.emotes.loadBar.red;

                    if (percentA === 100) return `Pour - 0% ${red.start}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} 100% - Contre`;

                    if (percentF >= 10 && percentA >= 90) return `Pour - ${percentF}% ${blue.start}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF >= 20 && percentA >= 80) return `Pour - ${percentF}% ${blue.start}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF >= 30 && percentA >= 70) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF >= 40 && percentA >= 60) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if ((percentF === 50) && (percentA === 50)) return `Pour - 50% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} 50% - Contre`;

                    if (percentF >= 60 && percentA >= 40) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF >= 70 && percentA >= 30) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF >= 80 && percentA >= 20) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF >= 90 && percentA >= 10) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.end} ${percentA}% - Contre`;

                    if (percentF === 100) return `Pour - 100% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.end} 0% - Contre`;
                }


                sugg.edit({
                    content: null,
                    embeds: [
                        {
                            title: embed.title!,
                            description: `\`\`\`md\n# ${suggData.content}\n\`\`\``,
                            color: embed.color!,
                            fields: [
                                {
                                    name: `Réponse ${answer === "yes" ? "favorable " : answer === "bof" ? "mitigée " : answer === "no" ? "défavorable " : ""}de ${interaction.user.username}`,
                                    value : comment ? `\`\`\`md\n# ${comment}\`\`\`` : `\`\`\`md\n# Aucun commentaire.\`\`\``
                                },
                                {
                                    name: "Votes",
                                    value: drawVoteBar() ?? ""
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
                                    },
                                    disabled: true
                                }, {
                                    type: 2,
                                    style: 2,
                                    custom_id: "bofSugg",
                                    emoji: {
                                        name: "🤷"
                                    },
                                    disabled: true
                                }, {
                                    type: 2,
                                    style: 4,
                                    custom_id: "againstSugg",
                                    emoji: {
                                        name: "👎"
                                    },
                                    disabled: true
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
                                    disabled: true
                                }
                            ]
                        }
                    ]
                }).then(async () => {

                    const user = await client.users.fetch(suggData.userId).catch(() => null);

                    if (user) await user.send({
                        embeds: [
                            {
                                title: `Une réponse a été donnée à votre suggestion.`,
                                color: client.config.color.integer,
                                url: `https://discord.com/channels/${interaction.guild!.id}/${channels.suggests}/${suggData.msgId}`,
                            }
                        ]
                    }).catch(() => null);

                    suggData.moderated = true;
                    suggData.save();
                    await interaction.reply({
                        content: `**${client.emotes.yes} ➜ Réponse envoyée avec succès !**`,
                        ephemeral: true
                    });
                })
                break;
            }
        }
    }
}

export = new Suggest;