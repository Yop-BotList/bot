'use strict';

const Command = require("../../structure/Command.js"),
      bots = require("../../models/bots"),
      moment = require("moment"),
      { botslogs } = require("../../configs/channels.json");

class Like extends Command {
    constructor() {
        super({
            name: 'like',
            category: 'botlist',
            description: 'Voter pour un bot.',
            aliases: ["vote"],
            usage: 'like <mention>',
            example: ["like <@692374264476860507>"],
            cooldown: 3600
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member?.user.bot) return message.reply({ content: `**${client.no} ➜ Vous n'avez pas mentionné de bots, ou il n'est pas présent sur le serveur.**` });

        let botGet = await bots.findOne({ botID: member.user.id });

        if (!botGet) return message.reply({ content: `**${client.no} ➜ ${member.user.tag} n'est pas sur la liste.**`});

        if (botGet.verified !== true) return message.reply({ content: `**${client.no} ➜ ${member.user.tag} n'est pas encore vérifié, donc vous ne pouvez pas voter pour lui.**` });

        await bots.findOneAndUpdate({
            botID: member.user.id
        }, {
            $set: {
                likesCount: (botGet.likesCount ? botGet.likesCount+1 : 1),
                likeDate: `Le ${moment().format("Do MMMM YYYY")} à ${moment().format("HH")}h${moment().format("mm")}`
            }
        }, {
            upsert: true
        });

        botGet = await bots.findOne({ botID: member.user.id });

        client.channels.cache.get(botslogs).send({ content: `**${client.yes} ➜ <@${message.author.id}> vient juste de voter pour <@${member.user.id}> !\n➜ Votes: ${botGet.likesCount}**` });
        message.reply({ content: `**${client.yes} ➜ Vous avez bien voté pour ${member.user.tag}, il a maintenant ${botGet.likesCount} votes.**` });
    }
}

module.exports = new Like;