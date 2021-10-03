const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js"),
      { loading } = require("../../configs/emojis.json"),
      { botlogs } = require("../../configs/channels.json");

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
        
                // rows
                let row = new MessageActionRow()
                .addComponents(button, button2, button3, button4)
        
                let row2 = new MessageActionRow()
                .addComponents(button5, button6, button4);
        
                let row3 = new MessageActionRow()
                .addComponents(button9, button10, button4);
        
                let row4 = new MessageActionRow()
                .addComponents(button7, button8, button11, button4)
        
                // embeds
                const e = new MessageEmbed()
                .setTitle("Gérer le bot :")
                .setDescription(":one: Gérer les commandes.\n:two: Gérer les évènements.\n:three: Gérer le bot.\n:x: Annuler la commande.")
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
                .setDescription(":one: Redémarrer le bot.\n:four: Exécuter une commande dans la console.\n:three: Démarrer/Arrêter un maintenance.\n:x: Annuler la commande.")
                .setColor(client.color)
                .setThumbnail(message.guild.iconURL())
        
                const msg = await message.channel.send({ embeds: [e], components: [row] });
        
        
        
        const collector = msg.createButtonCollector((button) => button.clicker.user.id === message.author.id)
        
                collector.on("collect", async button => {
                    if (button.id === "cancel") return msg.edit(`**${client.yes} ➜ Commande annulée avec succès !**`, { components: null })
                    if (button.id === "one") msg.edit({ embeds: [e2], components: [row2] })
                    await button.reply.defer();
                    if (button.id === "four") {
                        msg.edit({ embeds: [e3] }, button4)
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = new MessageCollector(message.channel, filter, {
                            max: 1,
                            time: 15000
                        })
                        collector.on("collect", (m) => {})
                        collector.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) client.reloadCommand(value.content).then(async res => {
                                    await message.channel.send(res);
                                    value.delete()
                                    msg.delete()
                                    return;
                                });
                            });
                        })
                    }
                    if (button.id === "five") {
                        msg.edit({embeds: [e4] }, button4)
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = new MessageCollector(message.channel, filter, {
                            max: 1,
                            time: 15000
                        })
                        collector.on("collect", (m) => {})
                        collector.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) {
                                    if(!client.commands.has(value.content)) {
                                        message.channel.send(`**${client.no} ➜ Commande introuvable !**`)
                                        return msg.delete();
                                    }
                                    client.commands.delete(value.content).then(() => {
                                        message.channel.send(`**${client.yes} ➜ Commande \`${value.content}\` désactivée jusqu'au prochain redémarrage du bot.**`)
                                        value.delete()
                                        return msg.delete();
                                    }).catch(() => {
                                        message.channel.send(`**${client.no} ➜ Impossible de désactiver la commande \`${value.content}\`.**`)
                                        value.delete()
                                        return msg.delete();
                                    })
                                }
                            });
                        })
                    }
                    if (button.id === "two") msg.edit({ embeds: e5, components: row3 })
                    if (button.id === "eight") {
                        msg.edit({ embeds: [e6] }, button4)
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = new MessageCollector(message.channel, filter, {
                            max: 1,
                            time: 15000
                        })
                        collector.on("collect", (m) => {})
                        collector.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) client.reloadEvent(value.content).then(async res => {
                                    await message.channel.send(res);
                                    value.delete()
                                    msg.delete()
                                    return;
                                });
                            });
                        })
                    }
                    if (button.id === "nine") {
                        msg.edit({ embeds: [e7] }, button4)
                        const filter = (m) => m.author.id === message.author.id;
                        const collector = new MessageCollector(message.channel, filter, {
                            max: 1,
                            time: 15000
                        })
                        collector.on("collect", (m) => {})
                        collector.on("end", (collected) => {
                            collected.forEach((value) => {
                                if (value) {
                                    if(!client.events.has(value.content)) {
                                        message.channel.send(`**${client.no} ➜ Évènement introuvable !**`)
                                        return msg.delete();
                                    }
                                    const res = client.listeners(fileName)
                            client.off(fileName, res[0]).then(() => {
                                        message.channel.send(`**${client.yes} ➜ Évènement \`${value.content}\` désactivé jusqu'au prochain redémarrage du bot.**`)
                                        value.delete()
                                        return msg.delete();
                                    }).catch(() => {
                                        message.channel.send(`**${client.no} ➜ Impossible de désactiver l'évènement \`${value.content}\`.**`)
                                        value.delete()
                                        return msg.delete();
                                    })
                                }
                            });
                        })
                    }
                    if (button.id === "three") {
                        msg.edit({ embeds: [e8], components: [row4] })
                    }
                    if (button.id === "six") {
                        msg.edit({ content: `**${client.yes} ➜ Redémarrage en cours...**`, components: null })
                            client.channels.cache.get(botlogs).send(`**${loading} ➜ Redémarrage en cours...**`).then(() => {
                            client.destroy()
                            return process.exit()
                        })
                    }
                });
    }
}