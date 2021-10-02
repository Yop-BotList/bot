const { Schema, model } = require("mongoose");

botconfigShema = new Schema({
    suggests: { type: Number, required: false },
    warns: { type: Number, required: false }
}),

botconfigshema = module.exports = model("botconfig", botconfigShema)