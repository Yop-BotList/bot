'use strict';

const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js"),
      { prefix, owners, owner, mainguildid, color } = require("../configs/config.json"),
      { botlogs, ticketcategory, ticketslogs } = require('../configs/channels.json'),
      { ticketsaccess } = require("../configs/roles.json"),
      { escapeRegex, onCoolDown } = require("../fonctions/cooldown.js"),
      { boost } = require("../configs/emojis.json"),
      bumpChecker = require("../fonctions/bumpChecker"),
      user = require("../models/user"),
      confirmMp = new MessageButton()
      .setStyle("SUCCESS")
      .setCustomId("confirmMpMessage")
      .setEmoji("📥"),
      deleteMp = new MessageButton()
      .setStyle("DANGER")
      .setCustomId("deleteMpTicket")
      .setEmoji("🗑️"),
      rowMp = new MessageActionRow()
      .addComponents(confirmMp),
      rowDelete = new MessageActionRow()
      .addComponents(deleteMp),
      mpEmbed = new MessageEmbed()
      .setTitle("Support en MP")
      .setColor(color)
      .setDescription(`> **🇫🇷 ➜ Bonjour,\n> Voulez vous envoyer un message au support ?\n> Si oui, cliquez sur le bouton ci dessous.**\n\n> **🇺🇸 ➜ Hello,\n> Do you want to tell support ?\n> If yes, click on the button below.**`)
      .setFooter(`YopBot Support System`),
      deleteMpEmbed = new MessageEmbed()
      .setTitle("Support en MP")
      .setDescription("> **🇫🇷 ➜ Pour pouvoir supprimer le ticket, cliquez sur le bouton ci-dessous.\n> 🇺🇸 ➜ To delete the ticket, click on the button below.**")
      .setFooter("YopBot Support System")
      .setColor(color);

module.exports = async(client, message) => {
    bumpChecker(message);
  
    if (message.author.bot) return;
  
    /* MP SYSTEM */
  
    if (message.channel.type === "DM") {
      const guild = client.guilds.cache.get(mainguildid),
            ticket = guild?.channels.cache.find(x => x.name === `🎫・ticket-${message.author.discriminator}` && x.topic === `${message.author.id}`);
  
      if (ticket) {
        const webhooks = await ticket.fetchWebhooks();
            const hook = webhooks.first();
        if (message.attachments) {
          if (message.content) {
            await hook.send({
              content: message.content,
              files: [...message.attachments.values()]
            });
          } else {
            await hook.send({
              content: null,
              files: [...message.attachments.values()]
            });
          }
        } else {
          await hook.send({
            content: message.content
          });
        }
        return message.react("📨");
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
            let db = await user.findOne({ userID: message.author.id });
			if (db) {
				if (db.ticketsbl === true) {
              		await button.update({ content: `**${client.no} ➜ Vous êtes sur la liste noire des tickets. Vous ne pouvez donc pas contacter le STAFF.**`, embeds: [], components: [] })
              		return collector.stop()
            } 
            }    
            if (!ticket) {
              guild.channels.create(`🎫・ticket-${message.author.discriminator}`, {
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
                  content: "@here",
                  embeds: [deleteMpEmbed],
                  components: [rowDelete]
                });
  
                if (message.attachments) {
                  if (message.content) {
                    await hook.send({
                      content: message.content,
                      files: [...message.attachments.values()]
                    });
                  } else {
                    await hook.send({
                      content: null,
                      files: [...message.attachments.values()]
                    });
                  }
                } else {
                  await hook.send({
                    content: message.content
                  });
                }
  
                const ticketsChannel = client.channels.cache.get(ticketslogs);
<<<<<<< HEAD
                
                const mdg = message.content || "Aucun contenu"; ticketsChannel?.send({
=======
                ticketsChannel?.send({
>>>>>>> abc94aa9e40c9d21ca21c4d4ae54cdedbaa6c763
                  content: null,
                  embeds: [
                    new MessageEmbed()
                    .setTitle(`Nouveau ticket de ${message.author.username}#${message.author.discriminator}`)
                    .setTimestamp(new Date())
                    .setColor(client.color)
                    .addFields(
                      { name: ":id: ➜ ID :", value: `\`\`\`${message.author.id}\`\`\``, inline: false},
<<<<<<< HEAD
                      { name: ":newspaper2: ➜ Raison :", value: `\`\`\`md\n# ${mdg}\`\`\``, inline: false },
=======
                      { name: ":newspaper2: ➜ Raison :", value: `\`\`\`md\n# ${message.content}\`\`\``, inline: false },
>>>>>>> abc94aa9e40c9d21ca21c4d4ae54cdedbaa6c763
                    )
                  ]
                });
              });
  
              await button.update({
                content: "> **🇫🇷 ➜ Votre message à bien été envoyé au support.\n> 🇺🇸 ➜ Your message has been succefully sent to the support**",
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
  
    if (message.channel.name.startsWith("🎫・ticket-")) {
      const user = await client.users.fetch(message.channel.topic);
      if (message.content.startsWith("!")) return
      if (message.author.bot) return
      if (!message.member.roles.cache.has(ticketsaccess)) {
        message.react("❌")
        return message.author.send(`**${client.no} ➜ Vous n'avez pas l'autorisation d'envoyer un message dans ce ticket.**`)
      }
  
  
      if (message.attachments) {
        if (message.content) {
          await user?.send({
            content: `**${boost} ➜ ${message.author.username} :** ${message.content}`,
            files: [...message.attachments.values()]
          });
        } else {
          await user?.send({
            content: `**${boost} ➜ ${message.author.username} :** ${message.content}`,
            files: [...message.attachments.values()]
          });
        }
      } else {
        await user?.send({
          content: `**${boost} ➜ ${message.author.username} :** ${message.content}`
        });
      }
  
      return message.react("📨");
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
    if (matchedPrefix.includes(client.user.id) && message.author.id == "692374264476860507") return message.reply({ content: `Bonjour maître. Mon préfixe est \`${prefix}\`` });
  }
  if (message.content.includes(client.user.username)) message.react("👀");
    const data = message.content;
    message.guild.prefix = client.config.prefix;
    const arg = data.slice(message.guild.prefix.length).trim().split(/ +/g);
    
    if (!data.startsWith(message.guild.prefix)) return;

    const command = client.commands.find(cmd => cmd.aliases.includes(arg[0])) || client.commands.get(arg[0]);
    if (!command) return;
    if (message.channel.type === "dm") return;
    let db = await user.findOne({ userID: message.author.id, cmdbl: true });
    if (db) return message.reply({ content: `**${client.no} ➜ Vous êtes sur la liste noire des commandes. Vous ne pouvez donc pas en utiliser.**` })
    if(command.botNotAllowed && message.author.bot) return;
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

    if(command.perms === "owner") {
        if(!client.config.owners.includes(message.author.id) && client.config.owner !== message.author.id) {
            return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cette commande.**`);
        }
    }else if(command.perms !== 'everyone') {
        if(!message.member.permissions.has(command.perms) && !message.member.roles.cache.has(command.perms)) {
            return message.channel.send(`**${client.no} ➜ Vous n'avez pas la permission d'utiliser cette commande.**`);
        }
    }
     if(command.botPerms !== []) {
      let perms = []
         for(let i = 0;i < command.botPerms.length; i++) {
             if(!message.guild.members.cache.get(client.user.id).permissions.has(command.botPerms[i])) {
                
                perms.push(`\`${command.botPerms[i]}\``);
             }
         }
         if(perms.length >= 1){
            return message.channel.send(`**${client.no} ➜ Il me manque les permissions suivantes pour pouvoir exécuter cette commande : ${perms.join("\n")}`);
         }
     }
  /* Cooldown */
  if (onCoolDown(message, command) && !owners.includes(message.author.id) && owner !== message.author.id) return message.reply({ content: `**${client.no} ➜ Veuillez patienter encore ${onCoolDown(message, command)} avant de pouvoir réutiliser la commande \`${command.name}\` !**` });

    try {
        command.run(client, message, args)
    } catch (err) {
       client.emit('error',err);
    }
};
