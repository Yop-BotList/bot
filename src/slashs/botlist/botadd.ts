import { ApplicationCommandOptionType, CommandInteraction, PermissionsBitField } from "discord.js";
import Class from "../..";
import { config } from "../../configs";
import Slash from "../../utils/Slash";

class BotAdd extends Slash {
    constructor() {
        super({
            name: "botadd",
            description: "Ajoute un bot à la liste.",
            description_localizations: {
                "en-US": "Add a bot to the list"
            },
            dm_permission: false,
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            options: [
                {
                    name: "bot-id",
                    type: ApplicationCommandOptionType.String,
                    description: "L'id du bot",
                    descriptionLocalizations: {
                        "en-US": "Bot ID to add"
                    },
                    min_length: 18,
                    required: true
                }, {
                    name: "prefix",
                    type: ApplicationCommandOptionType.String,
                    description: "Le prefix du bot",
                    descriptionLocalizations: {
                        "en-US": "Bot prefix"
                    },
                    required: true
                }
            ],
            guild_id: config.mainguildid
        });
    }

    async run(client: Class, interaction: CommandInteraction) {
        const botId = interaction.options.get("bot-id");
        const botPrefix = interaction.options.get("prefix");

        const user = await client.users.fetch("")
    }
}

export = new BotAdd;