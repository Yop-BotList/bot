const { Schema, model } = require("mongoose"),

reqString = {
    type: String, required: false
},

botShema = new Schema({
    serverID: { type: String, required: false },
    botID: { type: String, required: true },
    prefix: reqString,
    ownerID: reqString,
    verified: { type: Boolean, required: false },
    serverInvite: reqString,
    site: reqString,
    desc: reqString,
    likesCount: { type: Number, required: false },
    likeDate: reqString
}),

botsShema = module.exports = model("bots", botShema);