const { Schema, model } = require("mongoose"),

rmdShema = new Schema({
    userId: { type: String, required: false },
    chanId: { type: String, required: false },
    endsAt: { type: String, required: false }
}),

rmdsShema = module.exports = model("reminds", rmdShema);
