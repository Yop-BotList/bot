import { Interaction } from "discord.js";
import Class from "..";
import TicketsDM from "../functions/ticketsDM";
import { users, bots } from "../models";
import FaqModal from "../modals/FaqModal";
import SendModal from "../utils/SendModal";
import suggestManager from "../functions/suggestManager";
import { roles } from "../configs"

export = async (client: Class, interaction: Interaction) => {
    const ticketManager = new TicketsDM(client);

    if (interaction.isChatInputCommand()) {
        const slash = client.slashs.get(interaction.commandName);

        if (!slash) return;

        try {
            await slash.run(client, interaction);
        } catch (error: any) {
            interaction.reply({
                content: "Une erreur s'est produite lors de l'utilisation de cette commande.",
                ephemeral: true
            });
            new Error(error.stack || error);
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId === "faqVerifBtn") {
            const userFind = await users.findOne({ userId: interaction.user.id });

            if (!userFind) new users({
                readFaq: false,
                totalNumbers: 0,
                warns: [],
                avis: null,
                cmdbl: false,
                ticketsbl: false,
                userId: interaction.user.id
            }).save();

            const userGet = await users.findOne({ userId: interaction.user.id });

            if (userGet!.readFaq === true) return interaction.reply({
                ephemeral: true,
                content: "Vous avez déjà répondu à la faq, vous pouvez aller sur le reste du serveur."
            });

            const faqModal = new FaqModal();
            SendModal(client, interaction, faqModal);
            faqModal.handleSubmit(client, interaction);
        }

        if (interaction.customId === "forSugg") suggestManager("FOR", client, interaction);
        if (interaction.customId === "botSugg") interaction.reply({
            content: "Vous venez juste de voter pour cette suggestion.",
            ephemeral: true
        });
        if (interaction.customId === "againstSugg") suggestManager("AGAINST", client, interaction);
        if (interaction.customId === "suggestThread") {
            interaction.message.edit({
                embeds: interaction.message.embeds,
                components: [interaction.message.components[0]]
            });

            interaction.message.startThread({
                name: `Suggestion de ${interaction.message.embeds[0].title!.split(" ! ")[0].split(" ").slice(3).join(" ")}`
            });
        }

        if (interaction.customId === "buttonTransfer") ticketManager.transfer(interaction);

        if (interaction.customId === "buttonClose") ticketManager.transcript(interaction, interaction.channelId);

        if (interaction.customId.endsWith("bugChangeStatus")) {
            const data = interaction.customId.split(".")

            const db = await bots.findOne({ botId: data[0] })
            //@ts-ignore
            if (!db || !interaction.member!.roles!.cache.has(roles.verificator) && interaction.user.id !== db!.ownerId && db.team && !db.team.includes(interaction.user.id)) return interaction.reply({ content: `**${client.emotes.no} ➜ Ce bot n'est pas listé ou ne vous appartient pas.**`, ephemeral: true })

            const bugData = db.bugs.find((x: any) => x.msgId === data[1])
            if (!bugData) return;

            interaction.reply({
                content: `**${client.emotes.question} ➜ Veuillez sélectionner un nouveau statut d'avancement sur la résolution du bug signalé par <@${bugData.submitter}>**`,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                customId: "menuSelectBugStatus",
                                placeholder: "Status de bugs",
                                options: [
                                    {
                                        label: "Investigations en cours...",
                                        value: "1",
                                        description: "Votre équipe de développement est actuellement en train de rechercher l'origine de ce bug.",
                                        emoji: { name: "🔍" },
                                        default: bugData.status === 1
                                    },
                                    {
                                        label: "Résolution en cours...",
                                        value: "2",
                                        description: "Votre équipe de développement est actuellement en train de tenter de résoudre ce bug.",
                                        emoji: { name: "💻" },
                                        default: bugData.status === 2
                                    },
                                    {
                                        label: "Correctif publié lors de la prochaine mise à jour",
                                        value: "3",
                                        description: "Votre équipe de développement a résolu ce bug. Il sera corrigé lors de la prochaine mise à jour.",
                                        emoji: { name: "📆" },
                                        default: bugData.status === 3
                                    },
                                    {
                                        label: "Corrigé !",
                                        value: "4",
                                        description: "Ce bug a été corrigé !",
                                        emoji: { name: "✅" },
                                        default: bugData.status === 4
                                    }
                                ]
                            }
                        ]
                    }
                ],
                ephemeral: true
            })
        }
    }
}