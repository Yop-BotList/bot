const { Schema, model } = require("mongoose"),

userShema = new Schema({
    userId: { type: String, required: false },
    avis: { type: String, required: false }
}),

usersShema = module.exports = model("avis", userShema);
