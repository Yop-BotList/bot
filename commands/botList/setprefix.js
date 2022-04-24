'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require('discord.js'),
      bots = require("../../models/bots"),
      { prefix } = require("../../configs/config.json"),
      { botslogs } = require('../../configs/channels.json'),
      { verificator } = require("../../configs/roles.json");

class Setprefix extends Command {
    constructor() {
        super({
            name: 'setprefix',
            category: 'botlist',
            description: 'Définir le préfixe d\'un bot.',
            aliases: ["botprefix"],
            usage: 'setprefix <id> <prefix>',
            example: ["setdesc 692374264476860507 ??"],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        if (!args[0]) return message.channel.send(`\`\`\`${prefix}setprefix <id bot> <prefix>\`\`\``)
       const member = await message.guild.members.fetch(args[0]).catch(() => null)
        if (!member) return message.channel.send(`**${client.no} ➜ Veuillez entrer l'indentifiant valide d'un bot présent sur ce serveur.**`)
        const db = await bots.findOne({ botID: member.user.id });
        if (!db) return message.channel.send("**" + client.no + ' ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)**')
        if (db.ownerID !== message.author.id && !message.member.roles.cache.get(verificator)) return message.channel.send("**" + client.no + " ➜ Désolé, mais vous n'avez pas la permission d'utiliser cette commande.**")
        if (!args[1]) return message.channel.send("**" + client.no + ' ➜ Il faudrai peut-être entrer une préfixe non ?**')
            const e = new MessageEmbed()
            .setColor(client.color)
            .setTitle("Modification du profil...")
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp(new Date())
            .setDescription(`<@${message.author.id}> vient juste d'éditer la description de votre robot <@${member.id}> :`)
            .setFields({
                name: "➜ Avant :",
                value: `\`\`\`${db.prefix}\`\`\``,
                inline: false
            },
            {
                name: "➜ Après :",
                value: `\`\`\`args[1]\`\`\``,
                inline: false
            });

            client.channels.cache.get(botslogs)?.send({ content: `<@${db.ownerID}>`, embeds: [e] });
            
            setTimeout(async() => await bots.findOneAndUpdate({ botID: member.user.id }, { $set: { prefix: args[1] } }), 1000)
    }
}

module.exports = new Setprefix;
