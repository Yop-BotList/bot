const mongoose = require("mongoose"),
      { mongooseConnectionString } = require("../configs/config.json"),
      { red, green } = require("colors"),
      { online, offline } = require("../configs/emojis.json"),
      { botlogs } = require("../configs/channels.json");

module.exports = {
    init: () => {
        const mongoOptions = {
            useNewUrlParser: true,
            autoIndex: false, // Don't build indexes
            family: 4, // Use IPv4, skip trying IPv6
            useUnifiedTopology: true
        };
        mongoose.connect(mongooseConnectionString, mongoOptions)
        .then(() => {
            setTimeout(() => {
                console.log(green("[BOT]") + " Connecté à MongoDB !");
                //client.channels.cache.get(botlogs).send("**" + online + " | Base de données connectée !**")
            }, 1500)
        })
        .catch((err) => {
            console.log(red(`[BOT]`) + ` MongoDB déconnecté : ${err}`)
            //client.channels.cache.get(botlogs).send("**" + offline + " | Une erreur est survenue lors de ma connexion à la base de données !**")
        })
    }
}