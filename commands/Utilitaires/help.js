'use strict';

const { MessageEmbed } = require("discord.js"),
      Command = require("../../structure/Command.js"),
      { readdirSync } = require("fs")

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            category: 'utils',
            description: 'Recevoir de l\'aide sur le bot.',
            usage: 'help [commande]',
            example: ['help', 'help ping'],
            aliases: ['h', 'aide']
        });
    }

    async run(client, message, args) {
        if (!args[1]) {
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
              .setDescription(`Envoyez \`${client.config.prefix}help [commande]\` pour obtenir plus d'informations !`)
              .setFooter(`YopBot | Version ${client.version}`)
              .setTimestamp()
              .setColor(client.color);
            return message.channel.send({ content: null, embeds: [embed] });
          } else {
            const command =
              client.commands.get(args[1].toLowerCase()) ||
              client.commands.find(
                (c) => c.aliases && c.aliases.includes(args[1].toLowerCase())
              );
      
            if (!command) return message.channel.send({ content: `${client.no} ➜ Impossible de retrouver une commande nommée \`${client.config.prefix}${args[1]}\`` });
      
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
                `\`${client.config.prefix}${command.name}\``
              )
              .addField(
                "❱ Description :",
                command.description
                  ? command.description
                  : "*Aucune description définie.*"
              )
              .setTimestamp()
              .setColor(client.color);
            return message.channel.send({ content: null, embeds: [embed] });
          }
    }
}

module.exports = new Help;