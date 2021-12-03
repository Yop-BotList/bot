const { Schema, model } = require("mongoose");

counterShema = new Schema({
    userID: { type: String, required: false },
    number: { type: Number, required: false }
}),

countershema = module.exports = model("counter", counterShema)
