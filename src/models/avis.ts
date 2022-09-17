import { Schema, model } from "mongoose";

export default model("avis", new Schema({
    avis: { type: String, required: false },
    userId: { type: String, required: false },
    messageId: { type: String, required: false }
}));