const { Client, ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Voir la latece du bot.",
  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    await interaction.followUp({ content: `Pong :ping_pong: \`${Date.now() - message.createdTimestamp} ms\`` });
  },
};
