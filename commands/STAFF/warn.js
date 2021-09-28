const { Client, Message, MessageEmbed } = require('discord.js'),
      warns = require("../../models/sanction"),
      { modlogs } = require("../../configs/channels.json");

module.exports = {
    name: 'warn',
    aliases: ['w'],
    categories : 'staff', 
    permissions : 'MANAGE_MESSAGES', 
    description: 'Avertir un membre.',
    cooldown : 5,
    usage: 'warn <id> <raison>',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const member = client.users.cache.get(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer l'identifiant d'un membre présent sur ce serveur.**`)
        if (!args[1]) return message.reply(`**${client.no} ➜ Veuillez entrer une raison.**`)
        
        new warns({
            userID: member.username.id
        }).save()
    }
}