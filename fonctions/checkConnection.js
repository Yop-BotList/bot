const { connection } = require("mongoose"),
    { red, green } = require("colors"),
    { online, offline } = require("../configs/emojis.json"),
    { botlogs } = require("../configs/channels.json"),
    { Client } = require("discord.js"),

    /**
     * @param {Client} client
     */
checkConnection = module.exports = async (client) => {
    /* mongoose verification */
    connection.on("disconnected", () => {
        console.log(red("[DATABASE] MongoDB déconnecté !"))
        client.channels.cache.get(botlogs).send({ content: "**" + offline + " ➜ La base de donnée est déconnectée !**" })
    });
    connection.on("connected", () => {
        console.log(green("[DATABASE] MongoDB reconnecté ! !"))
        client.channels.cache.get(botlogs).send({ content: "**" + online + " ➜ La base de donnée est reconnectée !**" })
    });
}