const { Schema, model } = require("mongoose"),

userShema = new Schema({
    userId: { type: String, required: false },
    bumpCount: { type: Number, required: true }
}),

usersShema = module.exports = model("users", userShema);