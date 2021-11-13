'use strict';

const Command = require("../../structure/Command.js"),
      { verificator, isclient, botintests, listedbot } = require("../../configs/roles.json"),
      { prefix } = require("../../configs/config.json"),
      { botslogs } = require("../../configs/channels.json"),
      { MessageEmbed } = require("discord.js"),
      bots = require("../../models/bots"),
      user = require("../../models/user")

class Accept extends Command {
    constructor() {
        super({
            name: 'accept',
            category: 'staff',
            description: 'Accepter un bot sur la liste.',
            usage: 'accept <utilisateur>',
            example: ['accept <@692374264476860507>'],
            perms: verificator,
            cooldown: 1800,
            botPerms: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGES", "MANAGE_ROLES"]
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member?.user.bot) return message.reply({ content: `**${client.no}  ➜ Vous n'avez pas mentionné de bots, ou alors, il n'est pas présent sur le serveur.**` });

        let botGet = await bots.findOne({ botID: member.user.id });

        if (!botGet) return message.reply({ content: `**${client.no} ➜ Aucune demande n’a été envoyée pour ${member.user.tag} !**` });

        if (botGet.verified === true) return message.reply({ content: `${client.no} ➜ \`${member.user.tag}\` est déjà vérifié.` });

        await bots.findOneAndUpdate({
            botID: member.user.id
        }, {
            $set: {
                verified: true
            }
        }, {
            upsert: true
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
        const edg = await user.findOne({ userID: message.author.id })
        let vef = 0;
		try { if (edg) vef = edg.verifications + 1 } catch (err) { vef = 1 }
        if (edg) await user.findOneAndUpdate({ userID: message.author.id }, { $set: { verifications: vef } })
        if (!edg) new user({
            userID: message.author.id,
            verifications: 1
        }).save()

        message.channel.send({ content: `**${client.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être accepté !**` });
        
        client.users.cache.get(botGet.ownerID)?.send({
            content: null,
            embeds: [
                new MessageEmbed()
                .setTitle("Acceptation...")
                .setColor("#00FF2A")
                .setDescription(`Votre bot \`${member.user.tag}\` vient juste d'être accepté par nos vérificateurs.\nN'oublie pas nous laisser un avis via la commande \`${prefix}avis\` !`)
                .setFooter(`${client.user.username} de chez YopBot List`)
                .setTimestamp(new Date())
                .setThumbnail(member.user.displayAvatarURL())
            ]
        });

        member.roles.remove(botintests);
        member.roles.add(listedbot);
        message.guild.members.cache.get(botGet.ownerID)?.roles.add(isclient);
    }
}

module.exports = new Accept;
