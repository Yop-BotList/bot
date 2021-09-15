const { MessageEmbed, Collection } = require("discord.js");
var config = require("../configs/config.json");
const client = require("../index");
const prefix = config.prefix,
      { botlogs } = require('../configs/channels.json');

client.on("messageCreate", async (message) => {

  const { escapeRegex, onCoolDown } = require("../utils/function");
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  
  // getting mention prefix
  if (cmd.length === 0) {
    if (matchedPrefix.includes(client.user.id)) {
      message.reply(
        `<@${message.author.id}> Pour voir toutes les commandes, tapez \`${config.prefix}help\``
      );
    }
  }

  // command detection
  const command = client.commands.get(cmd.toLowerCase());
  if (!command) return;
  if (command) {
      // command logs
      const e = new MessageEmbed()
      .setTitle("Utilisation d'un commande")
      .setThumbnail(message.author.displayAvatarURL())
      .setColor(client.color)
      .setTimestamp(Date())
      .addField("➜ Utilisateur :", `\`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\``)
      .addField("➜ Commande :", "```" + message.content + "```")
      .addField("❱ Lien", `[Cliquez-ici](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) _Il se peut que cette personne aie supprimé ou édité son message._`)
      client.channels.cache.get(botlogs).send({ embeds: [e] })


    // perms
    if(command.permissions === "owner") {
      if(!config.owners.includes(message.author.id) && config.owner != message.author.id) {
          return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'exécuter cette commande !**`);
      }
  }
   else if(command.permissions !== 'everyone') {
      if(!message.member.permissions.has(command.permissions) && !message.member.roles.has(command.permissions)) {
          return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cette commande !**`);
      }
  }
    if (onCoolDown(message, command)) {
      return message.channel.send(`**${client.no} ➜ Veuillez patienter encore ${onCoolDown(message, command)} seconde(s) avant de pouvoir réutiliser la commande \`${command.name}\` !**`)
    }
    await command.run(client, message, args);
  }

  if (message.content.includes(client.user.username)) return message.react("👀")
});
