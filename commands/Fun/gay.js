const { Client, Message, MessageEmbed } = require("discord.js"),
      { prefix } = require("../../configs/config.json"),
      { verificator} = require("../../configs/roles.json");

module.exports = {
    name: "gay",
    categories: "fun",
    permissions: "everyone",
    description: "Signaler que tu es joyeux !",
    aliases: [],
    usage: "gay",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
        message.channel.send(`**:warning: ➜ Alerte à tout le monde ! <@${message.author.id}> est joyeux !**`)
        return message.delete()
    }
}