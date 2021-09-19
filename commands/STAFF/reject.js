const { verificator, isclient, botintests, listedbot } = require("../../configs/roles.json"),
    { autokick } = require("../../configs/config.json"),
    { botslogs } = require("../../configs/channels.json"),
    { Client, Message, MessageEmbed } = require("discord.js"),
    bots = require("../../models/bots");

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
     */
    run: async (client, message) => {
        if (!args[0]) return message.reply({ content: `**${client.no} ➜ Merci de me donner une ID de bot.**`});
        let botGet = await bots.findOne({ botID: args[0], verified: false });
        
        const member = message.guild.members.cache.get(botGet.botID);
        
        if (!botGet) return message.reply({ content: `**${client.no} ➜ Aucune demande n’a été envoyée pour ${member.user.tag} !**` });

        if (!args.slice(1).join(" ")) return message.reply({ content: `**${client.no} ➜ Vous n'avez pas donné de raison de refus` });
        
        
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

        message.channel.send({ content: `${client.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\`` });

        await bots.deleteOne({ botID: args[0] });

        if (autokick === true) member.kick();
    }
}
