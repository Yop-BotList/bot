const { Schema, model } = require("mongoose");

suggestShema = new Schema({
    userID: { type: String, required: false },
    msgID: { type: String, required: false },
    suggID: { type: Number, required: false },
    accepted: { type: Boolean, required: false },
    deleted: { type: Boolean, required: false },
    content: { type: String, required: false }
})

suggShema = module.exports = model("suggests", suggestShema)