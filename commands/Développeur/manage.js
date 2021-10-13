const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js"),
      { loading } = require("../../configs/emojis.json"),
      { botlogs } = require("../../configs/channels.json"),
      { exec } = require("child_process"),
      { owner } = require("../../configs/config.json"),
      user = require("../../models/user");

module.exports = {
    name: "manage",
    aliases: [],
    categories: "owner",
    permissions: "owner",
    description: "Permet de gérer le bot, les commandes et les évènements.",
    cooldown: 10,

    /**
     * @param {Message} message
     * @param {Client} client
     * @param {String[]} args
     */
    run: async(client, message, args) => {
                // buttons
                let button = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('1️⃣') 
                .setCustomId('one') 
        
                let button2 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('2️⃣') 
                .setCustomId('two')
        
                let button3 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('3️⃣') 
                .setCustomId('three') 
        
                let button4 = new MessageButton()
                .setStyle('DANGER')
                .setEmoji('❌') 
                .setCustomId('cancel')
        
                let button5 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('1️⃣') 
                .setCustomId('four') 
        
                let button6 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('2️⃣') 
                .setCustomId('five')
        
                let button7 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('1️⃣')
                .setCustomId('six')
        
                let button8 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('2️⃣')
                .setCustomId('seven')
                
                let button9 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('1️⃣') 
                .setCustomId('eight') 
        
                let button10 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('2️⃣') 
                .setCustomId('nine')
                
                let button11 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('3️⃣')
                .setCustomId('ten')

                let button12 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('4️⃣')
                .setCustomId('eleven')

                let button13 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('1️⃣')
                .setCustomId('twelve')

                let button14 = new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('2️⃣')
                .setCustomId('thirteen')

        
                // rows
                let row = new MessageActionRow()
                .addComponents(button, button2, button3, button12,button4)
        
                let row2 = new MessageActionRow()
                .addComponents(button5, button6, button4);
        
                let row3 = new MessageActionRow()
                .addComponents(button9, button10, button4);
        
                let row4 = new MessageActionRow()
                .addComponents(button7, button8, button11, button4)

                let row5 = new MessageActionRow()
                .addComponents(button13, button14, button4)

                let row6 = new MessageActionRow()
                .addComponents(button4)
        
                // embeds
                const e = new MessageEmbed()
                .setTitle("Gérer le bot :")
                .setDescription(":one: Gérer les commandes.\n:two: Gérer les évènements.\n:three: Gérer le bot.\n:four: Gérer la liste noire.\n:x: Annuler la commande.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const e2 = new MessageEmbed()
                .setTitle("Gérer les commandes :")
                .setDescription(":one: Recharger une commande.\n:two: Désactiver une commande.\n:x: Annuler la commande.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const e3 = new MessageEmbed()
                .setTitle("Recharger une commande :")
                .setDescription("Veuillez entrer le nom de la commande à recharger.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const e4 = new MessageEmbed()
                .setTitle("Désactiver une commande :")
                .setDescription("Veuillez entrer le nom de la commande à désactiver.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const e5 = new MessageEmbed()
                .setTitle("Gérer les évènements :")
                .setDescription(":one: Recharger un évènement.\n:two: Désactiver un évènement.\n:x: Annuler la commande.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const e6 = new MessageEmbed()
                .setTitle("Recharger un évènement :")
                .setDescription("Veuillez entrer le nom de l'évènement à recharger.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const e7 = new MessageEmbed()
                .setTitle("Désactiver un évènement :")
                .setDescription("Veuillez entrer le nom de l'évènement à désactiver.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
                
                const e8 = new MessageEmbed()
                .setTitle("Gérer le bot :")
                .setDescription(":one: Redémarrer le bot.\n:two: Exécuter une commande dans la console.\n:three: Démarrer/Arrêter un maintenance.\n:x: Annuler la commande.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())

                const e9 = new MessageEmbed()
                .setTitle("Exécuter une commande dans la console :")
                .setDescription("Veuillez entrer une commande à exécuter.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())

                const e10 = new MessageEmbed()
                .setTitle("Gérer la liste noire :")
                .setDescription("Veuillez entrer l'identifiant de l'utilisateur à gérer.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())

                const e11 = new MessageEmbed()
                .setTitle("Gérer la liste noire :")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
                .setDescription(":one: Ajouter/Retirer l'utilisateur à la liste noire des tickets.\n:two: Ajouter/Retirer l'utilisateur à la liste noire des commandes.\n:x: Annuler la commande.")

                const e12 = new MessageEmbed()
                .setTitle("Gérer la liste noire :")
                .setDescription("Veuillez entrer l'identifiant de l'utilisateur à modifier.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
                
                const msg = await message.channel.send({ embeds: [e], components: [row] });
        
                const filter = i => i.user.id === message.author.id;
                const collector = await msg.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });
        
                collector.on("collect", async button => {

                    if (button.customId === "cancel") {
                        msg.edit({ content: `**${client.yes} ➜ Commande annulée avec succès !**`, embeds: [], components: [] })
                        collector.stop()
                    }
                    if (button.customId === "one") msg.edit({ embeds: [e2], components: [row2] })
                    if (button.customId === "four") {
                        msg.edit({ embeds: [e3], components: [row6] })
                        const filter = (m) => m.author.id === message.author.id;
                        const collector1 = await msg.channel.createMessageCollector({ filter })
                        collector1.on("collect", (m) => {})
                        collector1.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) client.reloadCommand(value.content).then(async res => {
                                    await msg.edit({ content: res, embeds: [], components: [] });
                                    value.delete()
                                    return collector1.stop();
                                });
                            });
                        })
                    }
                    if (button.customId === "five") {
                        msg.edit({embeds: [e4], components: [row6] })
                        const filter = (m) => m.author.id === message.author.id;
                        const collector1 = await msg.channel.createMessageCollector({ filter })
                        collector1.on("collect", (m) => {})
                        collector1.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) {
                                    if(!client.commands.has(value.content)) {
                                        msg.edit({ content: `**${client.no} ➜ Commande introuvable !**`, embeds: [], components: [] })
                                        return collector1.stop()
                                    }
                                    client.commands.delete(value.content).then(() => {
                                        msg.edit({ content: `**${client.yes} ➜ Commande \`${value.content}\` désactivée jusqu'au prochain redémarrage du bot.**`, embeds: [], components: [] })
                                        value.delete()
                                        msg.delete()
                                        return collector1.stop()
                                    }).catch(() => {
                                        msg.edit({ content: `**${client.no} ➜ Impossible de désactiver la commande \`${value.content}\`.**`, embeds: [], components: [] })
                                        value.delete()
                                        msg.delete()
                                        return collector1.stop()
                                    })
                                }
                            });
                        })
                    }
                    if (button.customId === "two") msg.edit({ embeds: [e5], components: [row3] })
                    if (button.customId === "eight") {
                        msg.edit({ embeds: [e6], components: [row6] })
                        const filter = (m) => m.author.id === message.author.id;
                        const collector1 = await msg.channel.createMessageCollector({ filter })
                        collector1.on("collect", (m) => {})
                        collector1.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) client.reloadEvent(value.content).then(async res => {
                                    await msg.edit({ content: res, embeds: [], components: [] });
                                    value.delete()
                                    msg.delete()
                                    return collector1.stop();
                                });
                            });
                        })
                    }
                    if (button.customId === "nine") {
                        msg.edit({ embeds: [e7], components: [row6] })
                        const filter = (m) => m.author.id === message.author.id;
                        const collector1 = await msg.channel.createMessageCollector({ filter })
                        collector1.on("collect", (m) => {})
                        collector1.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) {
                                    if(!client.events.has(value.content)) {
                                        msg.edit({ content: `**${client.no} ➜ Évènement introuvable !**`, embeds: [], components: [] })
                                        msg.delete()
                                        return collector1.stop()
                                    }
                                    const res = client.listeners(fileName)
                            client.off(fileName, res[0]).then(() => {
                                        msg.edit({ content: `**${client.yes} ➜ Évènement \`${value.content}\` désactivé jusqu'au prochain redémarrage du bot.**`, embeds: [], components: [] })
                                        value.delete()
                                        msg.delete()
                                        return collector1.stop()
                                    }).catch(() => {
                                        msg.edit({ content: `**${client.no} ➜ Impossible de désactiver l'évènement \`${value.content}\`.**`, embeds: [], components: [] })
                                        value.delete()
                                        msg.delete()
                                        return collector1.stop()
                                    })
                                }
                            });
                        })
                    }
                    if (button.customId === "three") {
                        msg.edit({ embeds: [e8], components: [row4] })
                    }
                    if (button.customId === "six") {
                        msg.edit({ content: `**${client.yes} ➜ Redémarrage en cours...**`, components: null })
                            client.channels.cache.get(botlogs).send(`**${loading} ➜ Redémarrage en cours...**`).then(() => {
                            client.destroy()
                            collector.stop()
                            return process.exit()
                        })
                    }
                    if (button.customId === "seven") {
                        msg.edit({ embeds: [e9], components: [row6] })
                        const filter = (m) => m.author.id === message.author.id;
                        const collector1 = await msg.channel.createMessageCollector({ filter })
                        collector1.on("collect", (m) => {})
                        collector1.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) {

                                }
                            });
                        })
                    }
                    if (button.customId === "eleven") msg.edit({ embeds: [e11], components: [row5]})
                    if (button.customId === "twelve") {
                        msg.edit({ embeds: [e12], components: [row6] })
                        const filter = (m) => m.author.id === message.author.id;
                        const collector1 = await msg.channel.createMessageCollector({ filter })
                        collector1.on("collect", (m) => {})
                        collector1.on("end", (collected) => {
                            collected.forEach(async (value) => {
                                if (value) {
                                    const member = await client.users.fetch(value.content)
                                    if (!member) {
                                        msg.edit({ content: `**${client.no} ➜ Cet utilisateur est introuvable.**`, embeds: [], components: [] })
                                        value.delete()
                                        return collector.stop()
                                    }
                                    if (member.id === owner) {
                                        msg.edit({ content: `**${client.no} ➜ Vous ne pouvez pas ajouter mon propriétaire à la liste noire.**`, embeds: [], components: [] })
                                        value.delete()
                                        return collector.stop()
                                    }
                                    const db = await user.findOne({ userID: member.id })
                                    if (!db) {
                                        new user({
                                            userID: member.id,
                                            ticketsbl: true
                                        }).save()
                                        msg.edit({ content: `**${client.no} ➜ \`${member.tag}\` a bien été ajouté à la liste noire des tickets.**`, embeds: [], components: [] })
                                        value.delete()
                                        return collector.stop()
                                    }
                                    if (db.ticketsbl === true) {
                                        await user.findOneAndUpdate({ userID: member.id }, { $set: { ticketsbl: false } }, { upsert: true })
                                        msg.edit({ content: `**${client.no} ➜ \`${member.tag}\` a bien été retiré de la liste noire des tickets.**`, embeds: [], components: [] })
                                        value.delete()
                                        return collector.stop()
                                    }
                                    if (db.ticketsbl === false || !db.ticketsbl) {
                                        await user.findOneAndUpdate({ userID: member.id }, { $set: { ticketsbl: true } }, { upsert: true })
                                        msg.edit({ content: `**${client.no} ➜ \`${member.tag}\` a bien été ajouté à la liste noire des tickets.**`, embeds: [], components: [] })
                                        value.delete()
                                        return collector.stop()
                                    }
                                }
                            });
                        })
                    }
                });
    }
}