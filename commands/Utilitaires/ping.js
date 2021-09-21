const { Client, Message } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['p', 'latence'],
    categories : 'info', 
    permissions : 'everyone', 
    description: 'Voir la latence du bot.',
    cooldown : 5,
    usage: 'ping',
    /** 
     * @param {Client} client 
     * @param {Message} message
     */
    run: async(client, message) => {
        await message.channel.send(`Pong :ping_pong: \`${Date.now() - message.createdTimestamp} ms\``);
    }
}