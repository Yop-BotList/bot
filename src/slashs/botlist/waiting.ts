import {ButtonInteraction, CommandInteraction, InteractionResponse, Message} from "discord.js";
import Class from "../..";
import Slash from "../../utils/Slash";
import { bots } from "../../models"

class Waiting extends Slash {
    constructor() {
        super({
            name: "waiting",
            description: "Afficher la liste d'attente de la liste.",
            description_localizations: {
                "en-US": "Display the waiting list of the bot list."
            },
        });
    }

    async run(client: Class, interaction: CommandInteraction) {
        const data = await bots.find({ verified: false });
        const dataChecked = await bots.find({ checked: false });

        if (!data || data.length === 0 && dataChecked.length === 0) return interaction.reply({
            content: `**🎉 ➜ Félicitations, tous les robots en attente sont vérifiés !**`
        });

        let description = data.length === 0 && dataChecked.length > 0 ? dataChecked.map(bot => `- [${client.users.cache.get(`${bot.botId}`)?.tag || bot.botId}](https://discord.com/oauth2/authorize?client_id=${bot.botId}&permissions=0&scope=bot%20applications.commands)`).slice(0, 10).join(",\n") : data.map(bot => `- [${client.users.cache.get(`${bot.botId}`)?.tag || bot.botId}](https://discord.com/oauth2/authorize?client_id=${bot.botId}&permissions=0&scope=bot%20applications.commands)`).slice(0, 10).join(",\n");

        let components = data.length > 0 ? [{
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1,
                    label: 'Voir les robots en attente de re-vérification',
                    custom_id: 'btn',
                    disabled: dataChecked.length <= 0
                }
            ]
        }] : [];

        interaction.reply({
            embeds: [
                {
                    title: 'Liste des robots en attente de ' + ((data.length === 0 && dataChecked.length > 0) ? 're-' : '') + 'vérification:',
                    color: client.config.color.integer,
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: interaction.guild!.iconURL()!
                    },
                    footer: {
                        text: 'YopBot V' + client.version
                    },
                    description: description
                }
            ],
            components: components
        }).then(async (res: InteractionResponse) => {
            if (components.length === 0) return;

            const filter = (x: any) => x.user.id === interaction.user.id && x.customId === 'btn';
            const collector = await res.createMessageComponentCollector({ filter, time: 180000 })

            collector.on('collect', async (interaction: ButtonInteraction) => {
                await interaction.deferUpdate()

                await interaction.editReply({
                    embeds: [
                        {
                            title: 'Liste des robots en attente de re-vérification:',
                            color: client.config.color.integer,
                            timestamp: new Date().toISOString(),
                            thumbnail: {
                                url: interaction.guild!.iconURL()!
                            },
                            footer: {
                                text: 'YopBot V' + client.version
                            },
                            description: dataChecked.map(x => `- [${client.users.cache.get(`${x.botId}`)?.tag || x.botId}](https://discord.com/oauth2/authorize?client_id=${x.botId}&permissions=0&scope=bot%20applications.commands)`).slice(0, 10).join(",\n")
                        }
                    ],
                    components: []
                })
                collector.stop()
            })
        });
    }
}

export = new Waiting;