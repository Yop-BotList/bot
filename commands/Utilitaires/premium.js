const { Client, Message, MessageEmbed } = require('discord.js'),
      { premium, premiumbot } = require("../../configs/roles.json");

module.exports = {
    name: 'premium',
    aliases: [],
    categories : 'info', 
    permissions : 'everyone', 
    description: `Voir les informations sur le grade <@&${premium}>`,
    cooldown : 5,
    usage: 'ping',
    /** 
     * @param {Client} client 
     * @param {Message} message
     */
    run: async(client, message) => {
        const e = new MessageEmbed()
        .setTitle("Grade Premium...")
        .setColor(client.color)
        .setTimestamp(new Date())
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField("➜ Obtention :", `Le grade <@&${premium}> ne peut pas être obtenu gratuitement.\n Pour l'obtenir, vous devez le gagner lors d'un giveaway. Si vous êtes l'un de nos <@&784745567032573973> ou <@&828572424211398716> *(voir <#828531510772367391>)*, vous bénéfieciez aussi des avantages !`)
        .addField("➜ Avantages :", `• 2 bots.\n• Ajout d’un salon d’annonces dans le <#783013505225719829>*(seulement pour les 10 premiers)*.\n• Le grade <@&${premiumbot}> pour tout vos bots.\n• La possibilité de changer son pseudo.\n• La possibilité de créer des threads dans certains salons.`)

        message.channel.send({ embeds: [e] });
    }
}