import { Schema, model } from "mongoose";

export default model("verificators", new Schema({
    userId: { type: String, required: false },
    verifications: { type: Number, required: false }
}));