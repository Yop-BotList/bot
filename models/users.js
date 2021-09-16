const { Schema, model } = require("mongoose"),

userShema = new Schema({
    userId: { type: String, required: false },
    avis: { type: Boolean, required: false }
}),

usersShema = module.exports = model("users", userShema);