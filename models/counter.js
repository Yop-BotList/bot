const { Schema, model } = require("mongoose"),

counterShema = new Schema({
    lastNumber: { type: String, required: false },
    lastUser: { type: String, required: false }
}),

countersShema = module.exports = model("counter", counterShema);
