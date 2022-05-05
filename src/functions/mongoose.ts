import { green, red } from "colors";
import mongoose from "mongoose";
import { config } from "../configs";

export default {
    init: () => {
        const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            family: 4
        }

        mongoose.connect(config.mongooseConnectionString, mongoOptions)
        .then(() => {
            setTimeout(() => {
                console.log(green("[Bot]") + " Connecté à MongoDB !");
            }, 1500);
        }).catch(err => {
            console.log(red(`[BOT]`) + ` MongoDB déconnecté : ${err}`);
        })
    },
}