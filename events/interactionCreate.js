const client = require('../index'),
    { MessageEmbed } = require("discord.js"),
    { ticketslogs } = require("../configs/channels.json");


client.on("interactionCreate", async (interaction) => {

    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({ content: "Une erreur est survenue !" });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        cmd.run(client, interaction, args);
    }

    if (interaction.isButton()) {
        if (interaction.customId === "deleteMpTicket") {
            if (!interaction.channel.name.startsWith("🎫・ticket-")) return;

            const user = await client.users.fetch(interaction.channel.topic),
                channelLogs = client.channels.cache.get(ticketslogs);
            
            channelLogs.send({
                content: null,
                embeds: [
                    new MessageEmbed()
                    .setTitle(`Fermeture du ticket de ${user.username}#${user.discriminator}`)
                    .setTimestamp(new Date())
                    .setColor(client.color)
                    .addFields(
                        { name: `:id: ID :`, value: `\`\`\`${user.id}\`\`\``, inline: false },
                        { name: `:newspaper2: Raison :`, value: `\`\`\`Support en MP terminé\`\`\``, inline: false},
                        { name: `:man_police_officer: Modérateur :`, value: `\`\`\`${user.username}#${user.discriminator}\`\`\``, inline: false }
                    )
                ]
            });

            await user.send({
                content: `> **🇫🇷 ➜ Votre ticket sur le YopBot list à été fermé.\n> 🇺🇸 ➜ Your ticket on YopBot list has been closed.**`
            });

            return interaction.channel.delete();
        }
    }

    //Context menu handling
    if(interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if(command) command.run(client, interaction);
    }
});
