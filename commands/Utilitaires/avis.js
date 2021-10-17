'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js"),
      user = require("../../models/user"),
      { avischannel } = require("../../configs/channels.json"),
      { isclient } = require("../../configs/roles.json"),
      { prefix } = require("../../configs/config.json");

class Avis extends Command {
    constructor() {
        super({
            name: 'avis',
            category: 'utils',
            description: 'Donner un avis sur la vérification de son robot.',
            aliases: ['review', 'rate'],
            usage: 'review <avis>',
            example: ['avis Super serveur !', 'rate Vérification assez longue :/'],
            perms: isclient
        });
    }

    async run(client, message, args) {
        const userGet = await user.findOne({ userID: message.author.id, avis: true }),
        text = args.slice(1).join(" ");

        if (userGet) return message.reply({ content: `**${client.no} ➜ Tu ne peux pas donner d'avis car tu en a déjà donné un.**` });

        if (!text) return message.reply({ content: `**${client.no} ➜ Tu dois entrer un avis : \`${prefix}avis [avis]\`**`});

        const msg = await client.channels.cache.get(avischannel).send({
            content: null,
            embeds: [
                new MessageEmbed()
                .setTitle(`Avis de ${message.author.username} sur la vérification de son robot :`)
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp(new Date())
                .setDescription(`\`\`\`py\n"${text}"\`\`\``)
            ]
        });
        msg.react('💜');
        message.reply({ content: `**${client.yes} ➜ Votre avis a bien été envoyé !**` });
        
        await user.findOneAndUpdate({
            userID: message.author.id
        }, {
            avis: text
        }, {
            upsert: true
        })
    }
}

module.exports = new Avis;