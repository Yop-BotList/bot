const { Schema, model } = require("mongoose"),

bumpShema = new Schema({
    userId: { type: String, required: false },
    bumpCount: { type: Number, required: true }
}),

bumpsShema = module.exports = model("bumps", bumpShema);
