'use strict';

const Command = require("../../structure/Command.js"),
      { MessageEmbed } = require("discord.js"),
      moment = require("moment"),
      bots = require("../../models/bots"),
      { prefix, mainguildid } = require("../../configs/config.json");

moment.locale('fr')

class Botprofil extends Command {
    constructor() {
        super({
            name: 'botprofil',
            category: 'botlist',
            description: 'Voir le profil d\'un robot.',
            usage: 'botprofil <mention>',
            example: ["botprofil <@692374264476860507>"],
            cooldown: 10
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.channel.send(`**${client.no} ➜ Veuillez entrer la mention d'un robot présent sur ce serveur.**`)
        let db = await bots.findOne({ botID: member.user.id })
        if (!db) return message.channel.send("**" + client.no + " ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste (ce n'est d'ailleurs peut-être même pas un bot)**")

            const votes = db.likesCount || 0,
                    lastlike = db.likeDate || "*Aucun vote...*",
                    site = db.site || "*Aucun site web...*",
                    support = db.serverInvite || "*Aucun support...*",
                    description = db.desc || "*Aucune description...*",
                    e = new MessageEmbed()
                    .setTitle(`Informations sur le robot ${member.user.username}`)
                    .setColor(client.color)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp(new Date())
                    .setFooter(`${member.user.username} a rejoint la liste le ${moment(member.joinedAt).format('Do MMMM YYYY')}`)
                    .addFields({
                        name: '__:robot: Nom :__',
                        value: `> <@${member.user.id}>`,
                        inline: true
                    },
                    {
                        name: '__:key: Propriétaire :__',
                        value: `> <@${db.ownerID}>`,
                        inline: true
                    },
                    {
                        name: '__:bookmark_tabs: Préfixe :__',
                        value: `> ${db.prefix}`,
                        inline: true
                    },
                    {
                        name: '__:pencil: Description :__',
                        value: `> ${description}`,
                        inline: false
                    },
                    {
                        name: '__:question: Serveur support : __',
                        value: `> ${support}`,
                        inline: true
                    },
                    {
                        name: '__:globe_with_meridians: Site web :__',
                        value: `> ${site}`,
                        inline: true
                    },
                    {
                        name: '__:nut_and_bolt: Lien d\'invitation :__',
                        value: `> [Clique ici](https://discord.com/oauth2/authorize?client_id=${member.user.id}&scope=bot%20applications.commands&permissions=-1)`,
                        inline: false
                    },
                    {
                        name: '__:sparkling_heart: Vote(s) :__',
                        value: `> ${votes} vote(s)`,
                        inline: true
                    },
                    {
                            name: '__:two_hearts: Dernier like :__',
                            value: `${lastlike}`,
                            inline: true
                    })
            
            //Message
            message.channel.send({ embeds: [e] })
    }
}

module.exports = new Botprofil;