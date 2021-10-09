const { Client, Message, MessageEmbed } = require("discord.js"),
      { prefix } = require("../../configs/config.json"),
      { verificator} = require("../../configs/roles.json");

module.exports = {
    name: "invitegen",
    categories: "staff",
    permissions: verificator,
    description: "Générer une invitation.",
    aliases: ["ig"],
    usage: "invitegen <membre>",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
        const member = await client.users.fetch(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Veuillez entrer un identifiant valide.**`)
       if (!member.bot) return message.reply(`**${client.no} ➜ Cet utilisateur n’est pas un robot.**`)
       const e = new MessageEmbed()
       .setTitle("Générateur de liens d’invitation :")
       .setThumbnail(member.displayAvatarURL({ dynamic: true }))
       .setTimestamp(new Date())
       .setDescription(`Pour obtenir le lien d’invitation de ${member.tag}, [cliquez ici](https://discord.com/oauth2/authorize?client_id=${member.id}&permissions=0&scope=bot%20applications.commands)`)
    }
}