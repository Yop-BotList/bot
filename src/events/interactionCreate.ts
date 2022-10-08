import { Interaction } from "discord.js";
import Class from "..";
import TicketsDM from "../functions/ticketsDM";
import { users } from "../models";
import FaqModal from "../utils/FaqModal";
import SendModal from "../utils/SendModal";
import suggestManager from "../functions/suggestManager";

export = async (client: Class, interaction: Interaction) => {
    const ticketManager = new TicketsDM(client);

    if (interaction.isChatInputCommand()) {
        const slash = client.slashs.get(interaction.commandName);

        if (!slash) return;

        try {
            await slash.run(client, interaction);
        } catch (error: any) {
            interaction.reply("Une erreur s'est produite lors de l'utilisation de cette commande.");
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
            faqModal.handleSubmit(interaction);
        }

        if (interaction.customId === "forSugg") suggestManager("FOR", client, interaction);
        if (interaction.customId === "botSugg") interaction.reply({
            content: "Vous venez juste de voter pour cette suggestion.",
            ephemeral: true
        });
        if (interaction.customId === "againstSugg") suggestManager("AGAINST", client, interaction);

        if (interaction.customId === "buttonTransfer") ticketManager.transfer(interaction);

        if (interaction.customId === "buttonClose") ticketManager.transcript(interaction, interaction.channelId);
    };
}