const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['p', 'latence'],
    categories : 'info', 
    permissions : ' ', 
    description: 'Voir la latence du bot.',
    cooldown : 5,
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        await message.channel.send('Pong :ping_pong:').then(msg => {
            msg.edit(`Pong :ping_pong: \`${Math.sqrt(((new Date() - message.createdTimestamp)/(5*2))**2)} ms\``)
        });
    }
}