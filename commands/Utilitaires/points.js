  
const { Client, Message, MessageEmbed } = require('discord.js'),
bumps = require("../../models/bumps"),
{ prefix } = require("../../configs/config.json");

module.exports = {
name: 'points',
aliases: ["bumps"],
categories : 'utils', 
permissions : 'everyone', 
description: "Permet de savoir votre nombre de bumps pour le serveur ou celui d'un membre.",
cooldown : 5,
usage: 'points [user]',
/** 
 * @param {Client} client 
 * @param {Message} message
 */
run: async(client, message) => {
    let member = message.mentions.members.first() ? message.mentions.members.first() : message.member;

    let userGet = await bumps.findOne({ userId: member.user.id });

    if (!userGet) return message.reply({ content: `${client.no} | **<@${member.user.id}> n'a pas bumpé le serveur pour le moment, réutilise cette commande une fois qu'il aura bumpé.**` });

    message.reply({ content: `<@${member.user.id}> à actuellement ${userGet.bumpCount} bump pour le serveur.` });
}
}