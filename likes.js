const { Schema, model } = require("mongoose");

const likeShema = new Schema({
    botID: { type: String, required: true },
    serverID: { type: String, required: true },
    likesCount: { type: Number, required: false },
    likeDate: { type: String, required: false }
});

const likeshema = module.exports = model("likeshema", likeShema);