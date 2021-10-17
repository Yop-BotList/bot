'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js"),
      { premium, premiumbot } = require("../../configs/roles.json");

class Premium extends Command {
    constructor() {
        super({
            name: 'premium',
            category: 'utils',
            description: `Voir des informations sur le rôle <@&${premium}>`,
            aliases: [],
            example: [],
            perms: '',
            usage: '',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const e = new MessageEmbed()
        .setTitle("Grade Premium...")
        .setColor(client.color)
        .setTimestamp(new Date())
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField("➜ Obtention :", `Le grade <@&${premium}> ne peut pas être obtenu gratuitement.\n Pour l'obtenir, vous devez le gagner lors d'un giveaway. Si vous êtes l'un de nos <@&784745567032573973> ou <@&828572424211398716> *(voir <#828531510772367391>)*, vous bénéfieciez aussi des avantages !`)
        .addField("➜ Avantages :", `• 2 bots.\n• Ajout d’un salon d’annonces dans le <#783013505225719829> *(seulement pour les 10 premiers)*.\n• Le grade <@&${premiumbot}> pour tout vos bots.\n• La possibilité de changer son pseudo.\n• La possibilité de créer des threads dans certains salons.`)

        message.channel.send({ embeds: [e] });
    }
}

module.exports = new Premium;