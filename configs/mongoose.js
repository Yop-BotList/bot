const mongoose = require("mongoose"),
      { DBCONNECTION } = require("./config.json"),
      { red, blue } = require("colors"),
      { online, offline } = require("./emojis.json"),
      { botlogs } = require("./channels.json");

module.exports = {
    init: () => {
        const mongoOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoIndex: false, // Don't build indexes
            poolSize: 10, // Maintain up to 10 socket connections
            family: 4, // Use IPv4, skip trying IPv6
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        mongoose.connect(DBCONNECTION, mongoOptions)
        .then(() => {
            setTimeout(() => {
                console.log(blue(`- Connexion à MongoDB réussie !`) + "\n==================================================================");
                //client.channels.cache.get(botlogs).send("**" + online + " | Base de données connectée !**")
            }, 1500)
        })
        .catch((err) => {
            console.log("==================================================================" + red(`[MONGO_ERROR] ${err}`))
            //client.channels.cache.get(botlogs).send("**" + offline + " | Une erreur est survenue lors de ma connexion à la base de données !**")
        })
    }
}