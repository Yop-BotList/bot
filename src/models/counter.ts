import { Schema, model } from "mongoose";

export default model("counter", new Schema({
    counter: { type: Number, required: false, default: 0 },
    lastCountUser: { type: String, required: false }
}));