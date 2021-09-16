const { verificator, isclient, botintests, listedbot } = require("../../configs/roles.json"),
    { prefix } = require("../../configs/config.json"),
    { Client, Message, MessageEmbed } = require("discord.js"),
    bots = require("../../models/bots");

module.exports = {
    name: 'accept',
    aliases: ["acc", "acpt"],
    categories : 'botlist', 
    permissions : `${verificator}`, 
    description: 'Permet de rajouter un vote à un bot sur la liste.',
    cooldown : 3600,
    usage: 'like (bot)',

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message) => {
        if (!message.member.roles.cache.get(verificator)) return message.reply({ content: `${client.no} | Vous n'avez pas le rôle vérificateur.` });

        const member = message.mentions.members.first();
        if (!member?.user.bot) return message.reply({ content: `${client.no} | Vous n'avez pas mentionné de bots.` });

        let botGet = await bots.findOne({ botID: member.user.id });

        if (!botGet) return message.reply({ content: `${client.no} | ${member.user.tag} n'est pas sur la liste.` });
        if (botGet.verified !== false) return message.reply({ content: `${client.no} | Ce bot est déjà vérifié.` });

        await bots.findOneAndUpdate({
            botID: member.user.bot
        }, {
            verified: true
        }, {
            new: true
        });

        botGet = await bots.findOne({ botID: member.user.id });

        client.channels.cache.get().send({
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

        message.channel.send({ content: `${client.yes} | Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être accepté !` });
        
        member.roles.remove(botintests);
        member.roles.add(listedbot);
        message.guild.members.cache.get(botGet.ownerID).roles.add(isclient);
    }
}
