const { Client, MessageEmbed, ContextMenuInteraction } = require("discord.js");


module.exports = {
  name: "avatar",
  description: "Voir votre avatar ou celui d'un autre menbre.",

  /**
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   */
  run: async (client, interaction) => {

    let user = interaction.author,
    avs = new MessageEmbed()
      .setAuthor(
        `Avatar de : ${user.tag}`,
        user.displayAvatarURL({ dynamic: true }),
        "https://discord.gg/3dQeTg9Vz3"
      )
      .setColor(client.color)
      .addField(
        "➜ PNG",
        `[\`Lien\`](${user.displayAvatarURL({ format: "png" })})`,
        true
      )
      .addField(
        "➜ JPEG",
        `[\`Lien\`](${user.displayAvatarURL({ format: "jpg" })})`,
        true
      )
      .addField(
        "➜ WEBP",
        `[\`Lien\`](${user.displayAvatarURL({ format: "webp" })})`,
        true
      )
      .setURL(
        user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 512,
        })
      )
      .setTimestamp()

      interaction.followUp({ content: null, embeds : [avs] })
  },
};
