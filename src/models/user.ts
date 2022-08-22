import { Schema, model } from "mongoose";

export default model("users", new Schema({
    userId: { type: String, required: false },
    avis: { type: String, required: false },
    cmdbl: { type: Boolean, required: false },
    ticketsbl: { type: Boolean, required: false },
    warns: { type: Number, required: false },
    totalNumbers: { type: Number, required: false, default: 0 }
}));