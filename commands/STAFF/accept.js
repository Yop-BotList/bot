const { verificator, isclient, botintests, listedbot } = require("../../configs/roles.json"),
    { prefix } = require("../../configs/config.json"),
    { botslogs } = require("../../configs/channels.json"),
    { Client, Message, MessageEmbed } = require("discord.js"),
    bots = require("../../models/bots");

module.exports = {
    name: 'accept',
    aliases: [],
    categories : 'staff', 
    permissions : verificator, 
    description: 'Permet d’accepter un bot sur la liste.',
    cooldown : 3600,
    usage: 'accept <user>',

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message) => {
        const member = message.mentions.members.first();
        if (!member?.user.bot) return message.reply({ content: `**${client.no}  ➜ Vous n'avez pas mentionné de bots, ou alors, il n'est pas présent sur le serveur.**` });

        let botGet = await bots.findOne({ botID: member.user.id, verified: false });

        if (!botGet) return message.reply({ content: `**${client.no} ➜ Aucune demande n’a été envoyée pour ${member.user.tag} !**` });

        await bots.findOneAndUpdate({
            botID: member.user.bot
        }, {
            verified: true
        }, {
            new: true
        });

        botGet = await bots.findOne({ botID: member.user.id });

        client.channels.cache.get(botslogs).send({
            content: `<@${botGet.ownerID}>`,
            embeds: [
                new MessageEmbed()
                .setTitle("Acceptation...")
                .setTimestamp(new Date())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor("#00FF2A")
                .setFooter(`Pense à laisser un avis au serveur via la commande ${prefix}avis ^^`)
                .setDescription(`<@${message.author.id}> vient juste d'accepter le bot ${member.user.username} !`)
            ]
        });

        message.channel.send({ content: `**${client.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être accepté !**` });
        
        member.roles.remove(botintests);
        member.roles.add(listedbot);
        message.guild.members.cache.get(botGet.ownerID).roles.add(isclient);
    }
}
