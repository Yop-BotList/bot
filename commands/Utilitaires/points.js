'use strict';

const Command = require("../../structure/Command.js"),
      bumps = require("../../models/bumps"),
      { prefix } = require("../../configs/config.json");

class Points extends Command {
    constructor() {
        super({
            name: 'points',
            category: 'utils',
            description: 'Voir le nombre de points de bump d\'un utilisateur.',
            aliases: ["pts"],
            example: ["pts <@692374264476860507>"],
            perms: 'everyone',
            usage: 'points [utilisateur]',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let userGet = await bumps.findOne({ userId: member.user.id });
    
        if (!userGet) return message.reply({ content: `**${client.no} ➜ \`${member.user.username}\` n'a pas bumpé le serveur pour le moment, réutilise cette commande une fois qu'il aura bumpé.**` });
    
        message.reply({ content: `**\`${member.user.username}\` a actuellement ${userGet.bumpCount} bump pour le serveur.**` });
    }
}

module.exports = new Points;