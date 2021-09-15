const { Client, Message } = require('discord.js'),
    bots = require("../../models/bots"),
    moment = require("moment"),
    { botslogs } = require("../../configs/channels.json");

module.exports = {
    name: 'like',
    categories : 'botlist', 
    permissions : ' ', 
    description: 'Permet de rajouter un vote à un bot sur la liste.',
    cooldown : 3600,
    usage: 'like (bot)',

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message) => {
        const member = message.mentions.members.first();
        if (!member?.user.bot) return message.reply({ content: `${client.no} | Vous n'avez pas mentionné de bots` });

        let botGet = await bots.findOne({ botID: member.user.id });

        if (!botGet) return message.reply({ content: `${client.no} | ${member.user.tag} n'est pas sur la liste.`});

        if (botGet.verified !== true) return message.reply({ content: `${client.no} | ${member.user.tag} n'est pas encore vérifié, donc vous ne pouvez pas voter pour lui.` });

        await bots.findOneAndUpdate({
            botID: member.user.id
        }, {
            $set: {
                likesCount: (botGet.likesCount ? botGet.likesCount+1 : 1),
                likeDate: `Le ${moment().format("Do MMMM YYYY")} à ${moment().format("HH")}h${moment().format("mm")}`
            }
        }, {
            new: true
        });

        botGet = await bots.findOne({ botID: member.user.id });

        client.channels.cache.get(botslogs).send({ content: `${client.yes} **| <@${message.author.id}> viens juste de voter pour <@${member.user.id}> !\nVotes: ${botGet.likesCount}**` });
        message.reply({ content: `${client.yes} | Vous avez bien voté pour ${member.user.tag}, il a maintenant ${botGet.likesCount}.` });
    }
}