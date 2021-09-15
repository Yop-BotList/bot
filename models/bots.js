const { Schema, model } = require("mongoose"),

reqString = {
    type: String, required: true
},

noReqString = {
    type: String, required: false
},

botShema = new Schema({
    botID: reqString,
    prefix: reqString,
    ownerID: reqString,
    verified: { type: Boolean, required: false },
    serverInvite: noReqString,
    site: noReqString,
    desc: noReqString,
    likesCount: { type: Number, required: false },
    likeDate: noReqString
}),

botsShema = module.exports = model("bots", botShema);