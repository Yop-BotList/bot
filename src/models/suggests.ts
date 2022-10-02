import { Schema, model } from "mongoose";

export default model("suggests", new Schema({
    content: { type: String, required: false },
    userId: { type: String, required: false },
    messageId: { type: String, required: false },
    suggId: { type: Number, required: false },
    accepted: { type: Boolean, required: false, default: false },
    deleted: { type: Boolean, required: false, default: false },
    for: { type: Number, required: false, default: 0 },
    against: { type: Number, required: false, default: 0 },
    voted: { type: [String], required: false }
}));