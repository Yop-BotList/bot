'use strict';

const { MessageEmbed } = require("discord.js"),
      { ticketslogs } = require("../configs/channels.json"),
      { ticketsaccess } = require("../configs/roles.json"),
      createHTML = require("create-html"),
      { writeFile } = require("fs");

module.exports = async(client, data) => {
    if(data.isMessageComponent()){
        if(data.isCommand()){
            client.emit('slashCommands',data)
        }
    }

    if (data.isButton()) {
        if (data.customId === "deleteMpTicket") {
            if (!data.channel.name.startsWith("🎫・ticket-")) return;
            if (!data.member.roles.cache.has(ticketsaccess)) return data.author.send(`**${client.no} ➜ Vous n'avez pas l'autorisation de fermer ce ticket.**`)

            const user = await client.users.fetch(data.channel.topic),
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
                        { name: `:man_police_officer: Modérateur :`, value: `\`\`\`${data.user.username}#${data.user.discriminator}\`\`\``, inline: false }
                    )
                ]
            });

            await user.send({
                content: `> **🇫🇷 ➜ Votre ticket sur YopBot List à été fermé.\n> 🇺🇸 ➜ Your ticket on YopBot list has been closed.**`
            });
            data.channel.send(`**${client.yes} ➜ Fermeture du ticket dans 10 secondes...**`)

            //transcript
            const messagesCollection = await data.channel.messages.fetch({ limit: 100 });

            let body = ``;
            let avatar;
    
            messagesCollection.forEach(x => {
                const { author, content } = x;
                if (author.bot && author.discriminator !== "0000") return;
                if (author.avatar) {
                    avatar = `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`;
                }
                if (!content) return;
                body = body + `<p><img src="${avatar}" width="25px" height="25px" style="border-radius: 50%;">${author.username}#${author.discriminator}</p>\n<p>${content}</p>\n\n`;
            });
    
            var html = createHTML({
                title: user.id,
                scriptAsync: true,
                body: body + `\n\n<style>
        body { background-color: #2F3136 }
        p { color: white }
    </style>`,
            });
    
            writeFile(`../transcripts/${user.id}.html`, html, function (err) {
                if (err) console.log(err);
            });
    
    
            await channelLogs.send({
                content: null,
                embeds: [
                    new MessageEmbed()
                    .setTitle(`Fermeture du ticket de ${user.username}#${user.discriminator}`)
                    .setTimestamp(new Date())
                    .setColor(client.color)
                    .addFields(
                        { name: `:id: ID :`, value: `\`\`\`${user.id}\`\`\``, inline: false },
                        { name: `:man_police_officer: Modérateur :`, value: `\`\`\`${data.user.username}#${data.user.discriminator}\`\`\``, inline: false }
                    )
                ],
                files: [
                    `../transcripts/${user.id}.html`
                ]
            });
            return setTimeout(() => {
                data.channel.delete()
            }, 10000);
        }
    }
}