import { ApplicationCommandOptionType, CommandInteraction, PermissionsBitField } from "discord.js";
import Class from "../..";
import { config } from "../../configs";
import BotModal from "../../modals/BotModal";
import { bots } from "../../models";
import SendModal from "../../utils/SendModal";
import Slash from "../../utils/Slash";

class BotManagment extends Slash {
    constructor() {
        super({
            guild_id: config.mainguildid,
            name: "botmanagment",
            description: "Permet de gerer les informations de son robot.",
            description_localizations: {
                "en-US": "Manage your bot informations."
            },
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            options: [
                {
                    name: "bot-id",
                    type: ApplicationCommandOptionType.String,
                    description: "ID du bot",
                    descriptionLocalizations: {
                        "en-US": "Bot ID"
                    },
                    required: true,
                }, {
                    name: "information",
                    type: ApplicationCommandOptionType.String,
                    description: "Information a changer",
                    descriptionLocalizations: {
                        "en-US": "Information to change",
                    },
                    required: true,
                    choices: [
                        {
                            name: "description",
                            value: "description"
                        }, {
                            name: "prefix",
                            value: "prefix"
                        }, {
                            name: "site",
                            value: "site"
                        }, {
                            name: "support",
                            value: "supportInvite"
                        }
                    ]
                }
            ]
        });
    }
    
    async run(client: Class, interaction: CommandInteraction) {
        const botId = interaction.options.get("bot-id")!.value as string;
        const info = interaction.options.get("information")!.value as string;
        
        const botData = await bots.findOne({ botId: botId });
        
        if (!botData) return interaction.reply({
            content: `**${client.emotes.no} ➜ Ce bot n'est pas dans la base de données.**`,
            ephemeral: true
        });
        
        const oldValue = (type: string) => {
            if (type === "description") return `${botData.description}`;
            if (type === "prefix") return `${botData.prefix}`;
            if (type === "site") return `${botData.site}`;
            if (type === "supportInvite") return `${botData.supportInvite}`;

            return "";
        }
        
        const botModal = new BotModal(botId, info, oldValue(info));
        SendModal(client, interaction, botModal);
        botModal.handleSubmit(client, interaction);
    }
}

export = new BotManagment;