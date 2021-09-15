const { Client, Message, MessageEmbed } = require('discord.js'),
    bots = require("../../models/bots"),
    { prefix } = require("../../configs/config.json"),
    { botslogs } = require("../../configs/channels.json"),
    { verificator } = require("../../configs/roles.json");

module.exports = {
    name: 'botadd',
    aliases: ['addbot'],
    categories : 'botlist', 
    permissions : ' ', 
    description: 'Permet de rajouter un bot à la liste.',
    cooldown : 5,
    usage: 'botadd [id] [prefix]',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        /* Verification */
        if (message.mentions.members.first() || message.mentions.users.first()) return message.reply({ content: `**${client.no} ➜ Désolé je ne prend pas en charge les mentions.**` });
        if (!args[0]) return message.reply({ content: `**${client.no} ➜ Il manque l'id du bot dans la commande: \`${prefix}botadd [id] [prefix]\`**` });
        const user = message.guild.members.get(args[0]);
        if (!member) return message.reply({ content: `**${client.no} ➜ Membre introuvable !**` });
        if (!user.user.bot) return message.reply({ content: `**${client.no} ➜ Ce membre n’est pas un bot !**` });

        if (!args[1]) return message.reply({ content: `**${client.no} ➜ Préfixe introuvable !` });

        if (await bots.findOne({ botID: user.id })) return message.reply({ content: `**${client.no} ➜ ${user.tag} est déjà sur la liste !**` });

        new bots({
            botID: args[0],
            prefix: args[1],
            ownerID: message.author.id,
            verified: false
        });

        /* Responses */

        client.channels.cache.get(botslogs).send({
            content: `<@${message.author.id}> / \`<@&${verificator}>\``,
            embeds: [
                new MessageEmbed()
                .setTitle("Demande d'ajout...")
                .setDescription(`<@${message.author.id}> a demandé à ajouter le bot [${user.username}#${user.discriminator}](https://discord.com/oauth2/authorize?client_id=${user.id}&scope=bot%20application.commands&permissions=0). Un vérificateur va bientôt s’occuper de lui.`)
                .setColor("#66DA61")
                .setThumbnail(user.user.displayAvatarURL())
                .setTimestamp(new Date())
            ]
        });

        message.reply({ content: `**${client.yes} ➜ Votre bot \`${user.tag}\` vient juste d'être ajouté à la liste d’attente !` });
    }
}
