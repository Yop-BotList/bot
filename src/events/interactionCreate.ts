import { Interaction } from "discord.js";
import Class from "..";
import { users } from "../models";
import FaqModal from "../utils/FaqModal";
import SendModal from "../utils/SendModal";

export = async (client: Class, interaction: Interaction) => {
    if (!interaction.isButton()) return;

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
        faqModal.handleSubmit(interaction);
    }
}