const { Schema, model } = require("mongoose"),

wrnshema = new Schema({
    userID: { type: String, required: false },
    modID: { type: String, required: false },
    wrnID: { type: Number, required: false },
    reason: { type: String, required: false },
    date: { type: Number, required: false },
    type: { type: String, required: false }
}),

warnshema = module.exports = model("warns", wrnshema);
