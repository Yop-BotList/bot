const { Client, MessageEmbed, ContextMenuInteraction } = require("discord.js");


module.exports = {
  name: "avatar",
  description: "Voir votre avatar ou celui d'un autre menbre.",

  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   */
  run: async (client, interaction) => {

    let avs = new MessageEmbed()
      .setAuthor(
        `Avatar de : ${interaction.author.tag}`,
        interaction.author.displayAvatarURL({ dynamic: true }),
        "https://discord.gg/3dQeTg9Vz3"
      )
      .setColor(client.color)
      .addField(
        "➜ PNG",
        `[\`Lien\`](${interaction.author.displayAvatarURL({ format: "png" })})`,
        true
      )
      .addField(
        "➜ JPEG",
        `[\`Lien\`](${interaction.author.displayAvatarURL({ format: "jpg" })})`,
        true
      )
      .addField(
        "➜ WEBP",
        `[\`Lien\`](${interaction.author.displayAvatarURL({ format: "webp" })})`,
        true
      )
      .setURL(
        interaction.author.displayAvatarURL({
          dynamic: true,
        })
      )
      .setImage(
        interaction.author.displayAvatarURL({
          dynamic: true,
          size: 512,
        })
      )
      .setTimestamp()

      interaction.followUp({ content: null, embeds : [avs] })
  },
};
