import { ButtonInteraction, ComponentType, GuildTextBasedChannel, Message } from "discord.js";
import Class from "..";

export default async (client: Class, message: Message) => {
    if (!message.content.includes("discord.com/channels/")) return;
    
    const parts = message.content.split("/");
    
    const guildId = parts[4],
        channelId = parts[5],
        messageId = parts[6];

    if (!guildId || !channelId || !messageId) return;

    const guild = await client.guilds.cache.get(guildId),
        channel = await guild!.channels.cache.get(channelId) as GuildTextBasedChannel,
        messageData = await channel.messages.fetch(messageId);

    const description = messageData.content !== undefined ? `${messageData.content}` : "Ce message ne possède pas de contenu.",
        embeds = messageData.embeds.length !== 0 ? [{ name: "Embeds", value: "Ce message contient des embeds" }] : [],
        footer = messageData.components.length !== 0 ? "Ce message contient des components" : "";

    const msg = await message.reply({
        embeds: [
            {
                title: `Citation du message de ${messageData.author.tag} posté dans #${channel.name}`,
                description: description,
                color: client.config.color.integer,
                fields: embeds,
                footer: {
                    text: footer
                },
                url: messageData.url
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        custom_id: "showMessage",
                        style: 2,
                        label: "Montrer le message"
                    }
                ]
            }
        ]
    });

    const collector = await msg.createMessageComponentCollector({ time: 30000 });

    collector.on("collect", async (interaction: ButtonInteraction) => {
        if (interaction.customId === "showMessage") {
            let components: any[] = [];

            messageData.components.map(row => {
                let rowData: any = { type: row.type, components: [] };

                row.components.map(component => {
                    let componentData;
                    
                    if (component.type === ComponentType.Button) {
                        componentData = {
                            type: component.type,
                            custom_id: component.customId,
                            style: component.style,
                            label: component.label,
                            emoji: component.emoji,
                            url: component.url,
                            disabled: true
                        };
                    }

                    if (component.type === ComponentType.SelectMenu) {
                        componentData = {
                            type: component.type,
                            custom_id: component.customId,
                            options: component.options,
                            placeholder: component.placeholder,
                            min_values: component.minValues,
                            max_values: component.maxValues,
                            disabled: true
                        }
                    }

                    rowData.components.push(componentData);
                });

                components.push(rowData);
            });

            await interaction.reply({
                ephemeral: true,
                content: messageData.content || null,
                embeds: messageData.embeds.length !== 0 ? messageData.embeds : [],
                components: messageData.components.length !== 0 ? components : []
            }).catch(console.error);
        }
    });

    collector.on("end", async () => {
        msg.edit({
            embeds: [
                {
                    title: `Citation du message de ${messageData.author.tag} posté dans #${channel.name}`,
                    description: description,
                    color: client.config.color.integer,
                    fields: embeds,
                    footer: {
                        text: footer
                    },
                    url: messageData.url
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            custom_id: "showMessage",
                            style: 2,
                            label: "Montrer le message",
                            disabled: true
                        }
                    ]
                }
            ]
        });
    });
}