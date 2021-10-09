const { verificator, isclient, botintests, listedbot } = require("../../configs/roles.json"),
    { autokick } = require("../../configs/config.json"),
    { botslogs, modlogs } = require("../../configs/channels.json"),
    { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js"),
    bots = require("../../models/bots"),
    botconfig = require("../../models/botconfig"),
    warns = require("../../models/sanction")

module.exports = {
    name: 'reject',
    categories : 'staff', 
    permissions : verificator, 
    description: 'Permet de rejeter un bot de la liste.',
    cooldown : 3600,
    usage: 'reject <id> <raison>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const member = message.guild.members.cache.get(args[0]);
        if (!member) return message.reply({ content: `**${client.no} ➜ Merci de me donner un ID de bot valide et présent sur le serveur.**`})
        let botGet = await bots.findOne({ botID: args[0], verified: false });
        if (!botGet) return message.reply({ content: `**${client.no} ➜ Aucune demande n’a été envoyée pour ${member.user.tag} !**` });

        if (!args.slice(1).join(" ")) return message.reply({ content: `**${client.no} ➜ Vous n'avez pas donné de raison de refus.**` });
        
        
        client.channels.cache.get(botslogs).send({
            content: `<@${botGet.ownerID}>`,
            embeds: [
                new MessageEmbed()
                .setTitle("Refus...")
                .setTimestamp(new Date())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor("#FF0000")
                .setFooter(`Tu peux toujours corriger ce que ${message.author.username} demande et refaire une demande ^^`)
                .setDescription(`<@${message.author.id}> vient juste de refuser le bot ${member.user.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
            ]
        });
        const button = new MessageButton()
        .setCustomId("button")
        .setEmoji("⚠️")
        .setLabel(" ➜ Avertir l'utilisateur")
        .setStyle("PRIMARY")
        const row = new MessageActionRow()
        .addComponents(button)

        message.channel.send({ content: `**${client.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\`**`, components: [row] });

        
        const filter = i => i.user.id === message.author.id;
        const collector = await message.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });

        collector.on("collect", async button => {
            if (button.customId === "button") {
                const db = await botconfig.findOne()
        
                new warns({
                    userID: member.user.id,
                    modID: message.author.id,
                    wrnID: Number(db.warns) + 1,
                    reason: "Non respect des conditions d'ajout de bots.",
                    type: "WARN",
                    date: Date.now()
                }).save()
                await botconfig.findOneAndUpdate({}, { $set: { warns: db.warns + 1 } }, { upsert: true })
                
                const proprio = await client.users.fetch(botGet.ownerID)
                const e = new MessageEmbed()
                .setTitle("Nouvelle sanction :")
                .setThumbnail(proprio.displayAvatarURL({ dynamic: true }))
                .setColor(client.color)
                .setTimestamp(new Date())
                .addField(`:busts_in_silhouette: ➜ Utilisateur :`, `\`\`\`md\n# ${proprio.tag} ➜ ${proprio.id}\`\`\``)
                .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# WARN\`\`\``)
                .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# Non respect des conditions d'ajout de bots.\`\`\``)
                .addField(`:man_police_officer: ➜ Modérateur :`, `\`\`\`md\n# ${message.author.tag} ➜ ${message.author.id}\`\`\``)
                .addField(`:1234: Code`, `\`\`\`md\n# ${db.warns + 1}\`\`\``)
                const e2 = new MessageEmbed()
                .setTitle("Nouvelle sanction :")
                .setThumbnail(proprio.displayAvatarURL({ dynamic: true }))
                .setColor(client.color)
                .setTimestamp(new Date())
                .setFooter("En cas d'erreur, tu peux me répondre pour contacter le STAFF.")
                .addField(`:dividers: ➜ Type :`, `\`\`\`md\n# WARN\`\`\``)
                .addField(`:newspaper2: ➜ Raison(s) :`, `\`\`\`md\n# Non respect des conditions d'ajout de bots.\`\`\``)
                proprio.send({ embeds: [e2] }).catch(() => {
                    e.addField(":warning: Avertissement :", "L'utilisateur n'a pas été prévenu(e) de sa santion !")
                })
                client.channels.cache.get(modlogs).send({ embeds: [e] })
                message.reply(`**${client.yes} ➜ Utilisateur avertis avec succès.**`)
                return collector.stop()
            }
        });

        await bots.deleteOne({ botID: args[0] });

        if (autokick === true) member.kick();
    }
}
