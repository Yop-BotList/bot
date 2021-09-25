const { Schema, model } = require("mongoose");

botShema = new Schema({
    suggests: { type: Number, required: false }
})

robotShema = module.exports = model("botconfig", botShema)