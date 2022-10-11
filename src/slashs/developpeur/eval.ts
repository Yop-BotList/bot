import { CommandInteraction, PermissionsBitField } from "discord.js";
import Class from "../..";
import { config } from "../../configs";
import EvalModal from "../../modals/EvalModal";
import SendModal from "../../utils/SendModal";
import Slash from "../../utils/Slash";

class Eval extends Slash {
    constructor() {
        super({
            name: "eval",
            description: "Test un code.",
            description_localizations: {
                "en-US": "Evaluate a code."
            },
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            guild_id: config.mainguildid
        });
    }

    async run(client: Class, interaction: CommandInteraction) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({
            content: `**${client.emotes.no} ➜ Seuls les administrateurs du bot peuvent utiliser cette commande.**`,
            ephemeral: true
        });

        const evalModal = new EvalModal();
        SendModal(client, interaction, evalModal);
        evalModal.handleSubmit(client, interaction);
    }
}

export = new Eval;