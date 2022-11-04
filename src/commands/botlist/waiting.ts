import { ButtonInteraction, Message } from "discord.js";
import Class from "../..";
import { bots } from "../../models";
import Command from "../../utils/Command";
import { roles } from '../../configs'

class Waiting extends Command {
    constructor() {
        super({
            name: 'waiting',
            category: 'Botlist',
            description: 'Recevoir un liste de tous les robots en attente de vérification sur le serveur.',
            cooldown: 5,
            //requiredRole: roles.verificator
        })
    }

    async run(client: Class, message: Message): Promise<Message<boolean> | undefined> {
        const data = await bots.find({ verified: false });
        const dataChecked = await bots.find({ checked: false });

        if (!data || data.length === 0 && dataChecked.length === 0) return message.reply({
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
                    disabled: dataChecked.length > 0 ? false : true
                }
            ]
        }] : [];

        message.reply({
            embeds: [
                {
                    title: 'Liste des robots en attente de ' + ((data.length === 0 && dataChecked.length > 0) ? 're-' : '') + 'vérification:',
                    color: client.config.color.integer,
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: `${message.guild!.iconURL()}`
                    },
                    footer: {
                        text: 'YopBot V' + client.version
                    },
                    description: description
                }
            ],
            components: components
        }).then(async (msg: Message) => {
            if (components.length === 0) return;

            const filter = (x: any) => x.user.id === message.author.id && x.customId === 'btn';
            const collector = await msg.createMessageComponentCollector({ filter, time: 180000 })

            collector.on('collect', async (interaction: ButtonInteraction) => {
                await interaction.deferUpdate()

                msg.edit({
                    embeds: [
                        {
                            title: 'Liste des robots en attente de re-vérification:',
                            color: client.config.color.integer,
                            timestamp: new Date().toISOString(),
                            thumbnail: {
                                url: `${message.guild!.iconURL()}`
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