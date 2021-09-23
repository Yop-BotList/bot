const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js"),
  { prefix, owners, owner, mainguildid } = require("../configs/config.json"),
  client = require("../index"),
  { botlogs, ticketcategory } = require('../configs/channels.json'),
  { ticketsaccess } = require("../configs/roles.json"),
  { escapeRegex, onCoolDown } = require("../fonctions/cooldown.js"),
  bumpChecker = require("../fonctions/bumpChecker"),
  
  confirmMp = new MessageButton()
  .setStyle("SUCCESS")
  .setCustomId("confirmMpMessage")
  .setEmoji("📥"),
  deleteMp = new MessageButton()
  .setStyle("DANGER")
  .setCustomId("deleteMpTicket")
  .setEmoji("🗑️")
  rowMp = new MessageActionRow()
  .addComponents(confirmMp),
  rowDelete = new MessageActionRow()
  .addComponents(confirmMp),
  
  mpEmbed = new MessageEmbed()
  .setTitle("Support en MP")
  .setColor(client.color)
  .setDescription(`> 🇫🇷 Bonjour,\n> Voulez vous envoyer un message au support ?\n> Si oui, cliquez sur le bouton ci dessous.\n\n> 🇺🇸 Hello,\n> Do you want to tell support ?\n> If yes, click on the button below.`)
  .setFooter(`YopBot Support System`),
  deleteMpEmbed = new MessageEmbed()
  .setTitle("Support en MP")
  .setDescription("> 🇫🇷 Pour pouvoir supprimer le ticket, cliquez sur le bouton ci-dessous.\n> 🇺🇸 To dolete the ticket, click on the button below.")
  .setFooter("YopBot Support System");

client.on("messageCreate", async (message) => {
  bumpChecker(message);
  
  if (message.author.bot) return;

  /* MP SYSTEM */

  if (message.channel.type === "DM") {
    const guild = client.guilds.cache.get(mainguildid),
      ticket = guild?.channels.cache.find(x => x.name === `${message.author.tag}-ticket` && x.topic === `${message.author.id}`);

    if (ticket) {
      const webhooks = await ticket.fetchWebhooks();
		  const webhook = webhooks.first();
      return await webhook.send({
        content: message.content
      });
    }

    const msg = await message.author?.send({
      content: null,
      embeds: [mpEmbed],
      components: [rowMp]
    });

    const filter = btn => btn.customId === "confirmMpMessage" && btn.user.id === message.author.id;
    const collector = await msg.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });

    collector.on("collect", async (button) => {
      if (button.user.id === message.author.id) {
        if (button.customId === "confirmMpMessage") {        
          if (!ticket) {
            guild.channels.create(`${message.author.tag}-ticket`, {
              type: 'GUILD_TEXT',
              permissionOverwrites: [
                {
                  id: guild.id,
                  deny: ["VIEW_CHANNEL"]
                }, {
                  id: ticketsaccess,
                  allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "SEND_MESSAGES", "ATTACH_FILES"]
                }
              ],
              parent: ticketcategory,
              topic: `${message.author.id}`
            }).then(async ch => {
              const hook = await ch.createWebhook(message.author.username, {
                avatar: message.author.displayAvatarURL()
              });

              ch.send({
                content: null,
                embeds: [deleteMpEmbed],
                components: [rowDelete]
              });

              await hook.send({
                content: message.content
              });
            });

            await button.update({
              content: "> 🇫🇷 Votre message à bien été envoyé au support.\n> 🇺🇸 Your message has been succefully sent to the support",
              embeds: [],
              components: []
            });
            await collector.stop();
          }
        }
      }
    });

    return;
  }

  /* Guild System */

  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [matchedPrefix] = message.content.match(prefixRegex),
    args = message.content.slice(matchedPrefix.length).trim().split(/ +/),
    cmd = args.shift().toLowerCase();
  
  /* Getting Mention for Prefix */
  if (cmd.length === 0) {
    if (matchedPrefix.includes(client.user.id) && message.author.id !== "692374264476860507") return message.reply({ content: `<@${message.author.id}> Pour voir toutes les commandes, tapez \`${prefix}help\`` });
    if (matchedPrefix.includes(client.user.id) && message.author.id !== "692374264476860507") return message.reply({ content: `Bonjour maître. Mon préfixe est \`${prefix}\`` });
  }

  /* Command Detection */
  const command = client.commands.get(cmd.toLowerCase()) || client.aliases.get(cmd.toLowerCase());

  /* Commands Log */
  client.channels.cache.get(botlogs).send({
    content: null,
    embeds: [
      new MessageEmbed()
      .setTitle("Utilisation d'un commande")
      .setThumbnail(message.author.displayAvatarURL())
      .setColor(client.color)
      .setTimestamp(Date())
      .addField("➜ Utilisateur :", `\`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\``)
      .addField("➜ Commande :", "```" + message.content + "```")
      .addField("➜ Lien", `[Cliquez-ici](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) _Il se peut que cette personne aie supprimé ou édité son message._`)
    ] 
  })

  /* Perms */
  if(command.permissions === "owner") {
    if(!owners.includes(message.author.id) && owner != message.author.id) return message.reply({ content: `**${client.no} ➜ Vous n'avez pas la permission d'exécuter cette commande !**` });
  }else if(command.permissions !== 'everyone') {
    if(!message.member.permissions.has(command.permissions) || !message.member.roles.cache.has(command.permissions)) return message.reply({ content: `**${client.no} ➜ Vous n'avez pas la permission d'utiliser cette commande !**` });
  }

  /* Cooldown */
  if (onCoolDown(message, command) && !owners.includes(message.author.id) && owner !== message.author.id) return message.reply({ content: `**${client.no} ➜ Veuillez patienter encore ${onCoolDown(message, command)} avant de pouvoir réutiliser la commande \`${command.name}\` !**` });
  await command.run(client, message, args);

  if (message.content.includes(client.user.username)) return message.react("👀");
});
