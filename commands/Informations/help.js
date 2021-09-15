const { Client, CommandInteraction, MessageEmbed } = require("discord.js"),
  { readdirSync } = require("fs"),
  { prefix } = require("../../configs/config.json");

module.exports = {
  name: "help",
  aliases: ["h", "aide"],
  categories: "info",
  permissions: " ",
  description: "Recevoir de l'aide sur le bot.",
  usage: "help [commande]",
  /**
   * @param {Client} client
   * @param {CommandInteraction} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args[0]) {
      let categories = [];

      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js")),

        cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "Aucunes commandes";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: `➜ ${dir} :`,
          value: cmds.length === 0 ? "Aucunes commandes dans cette catégorie..." : cmds.join(", "),
        };

        categories.push(data);
      });

      const embed = new MessageEmbed()
        .setTitle(`Menu d'aide de ${client.user.username}`)
        .addFields(categories)
        .addField("➜ Liens :", "[GitHub](https://github.com/Nonolanlan1007/Yop-Bot) • [Serveur Support](https://discord.gg/3dQeTg9Vz3) • [Trello](https://trello.com/b/KHmaXsL4/yopbot) • [Signaler un bug](https://github.com/Nonolanlan1007/Yop-Bot/issues/new)")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`Envoyez \`${prefix}help [commande]\` pour obtenir plus d'informations !`)
        .setFooter(`YopBot | Version ${client.version}`)
        .setTimestamp()
        .setColor(client.color);
      return message.channel.send({ content: null, embeds: [embed] });
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

        let slashCommands;
        const scmd = client.slashCommands.get(command.name)

        if (!scmd) slashCommands = "Non"
        if (scmd) slashCommands = "Oui"

      if (!command) return message.channel.send({ content: `${client.no} ➜ Impossible de retrouver une commande nommée \`${prefix}${args[0]}\`` });

      const embed = new MessageEmbed()
        .setTitle(`Informations sur la commande ${command.name}`)
        .setDescription(" <> sont des arguments requis\nEt [] sont des arguments optionnels.")
        .addField(
          "❱ Commande :",
          command.name ? `\`${command.name}\`` : "*Aucun nom défini.*"
        )
        .addField(
          "❱ Aliases :",
          command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "*Aucuns aliases enregitrés pour cette commande.*"
        )
        .addField(
          "❱ Utilisation :",
          command.usage
            ? `\`${prefix}${command.usage}\``
            : `\`${prefix}${command.name}\``
        )
        .addField(
          "❱ Description :",
          command.description
            ? command.description
            : "*Aucune description définie.*"
        )
        .addField(
          "❱ Commande slash :",
          slashCommands
        )
        .setTimestamp()
        .setColor(client.color);
      return message.channel.send({ content: null, embeds: [embed] });
    }
  },
};
