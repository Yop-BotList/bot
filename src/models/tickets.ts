import { Schema, model } from "mongoose";

export default model("tickets", new Schema({
    channelId: { type: String, required: false },
    userId: { type: String, required: false },
    reason: { type: String, required: false }
}));