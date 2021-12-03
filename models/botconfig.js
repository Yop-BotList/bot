const { Schema, model } = require("mongoose");

botconfigShema = new Schema({
    suggests: { type: Number, required: false },
    warns: { type: Number, required: false },
    counter: { type: Number, required: false },
    lastCountUser: { type: String, required: false }
}),

botconfigshema = module.exports = model("botconfig", botconfigShema)