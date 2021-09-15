const { Schema, model } = require("mongoose"),

reqString = {
    type: String, required: true
},

noReqString = {
    type: String, required: false
},

botsShema = new Schema({
    botID: reqString,
    prefix: reqString,
    ownerID: reqString,
    verified: { type: Boolean, required: false },
    serverInvite: noReqString,
    site: noReqString,
    desc: noReqString,
    likesCount: { type: Number, required: false },
    likeDate: ReqString
}),

botShema = module.exports = model("bots", botShema);
