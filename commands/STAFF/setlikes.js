const { verificator } = require("../../configs/roles.json"),
    { botslogs } = require("../../configs/channels.json"),
    { Client, Message } = require("discord.js"),
    bots = require("../../models/bots");

module.exports = {
    name: 'setlikes',
    categories : 'staff', 
    permissions : verificator, 
    description: "Permet de rénitialiser ou changer le nombre de likes d'un bot.",
    cooldown : 3600,
    usage: 'setlikes <set/reset> <bot> <number>',

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message, args) => {
        if (!args[0]) return message.reply({ content: `${client.no} ➜ Merci de mettre une des deux options au lieu de aucune, \`set/reset\`` });
    
        if (args[0] === "set") {
            let bot = message.mentions.members.first();
            if (!bot) return message.reply({ content: `${client.no} ➜ Merci de mentionner un bot.` });
            if (!bot.user || !bot.user.bot) return message.reply({ content: `${client.no} ➜ ${args[1]} n'est pas un bot.` });
            let botGet = await bots.findOne({ botID: bot.user.id });
            if (!botGet) return message.reply({ content: `${client.no} ➜ \`${bot.user.tag}\` n'est pas sur la liste` });
        } else if (args[0] === "reset") {
            let bot = message.mentions.members.first();
            if (!bot) return message.reply({ content: `${client.no} ➜ Merci de mentionner un bot.` });
            if (!bot.user || !bot.user.bot) return message.reply({ content: `${client.no} ➜ ${args[1]} n'est pas un bot.` });
            let botGet = await bots.findOne({ botID: bot.user.id });
            if (!botGet) return message.reply({ content: `${client.no} ➜ \`${bot.user.tag}\` n'est pas sur la liste` })
        } else return message.reply({ content: `${client.no} ➜ Merci de mettre une des deux options, \`set/reset\`` });
    }
}