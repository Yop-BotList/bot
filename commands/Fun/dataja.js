const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "dataja",
    categories: "fun",
    permissions: "everyone",
    description: "Ne demandez pas si vous pouvez demander, mais demandez directement !",
    aliases: [],
    usage: "dataja",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
       message.reply('"Ne demande pas si tu peux demander, mais demande directement. Ça nous fait gagner du temps."\n*Source : <https://dontasktoask.com/>*')
       message.delete()
    }
}
