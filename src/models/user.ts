import { Schema, model } from "mongoose";

export default model("users", new Schema({
    userId: { type: String, required: false },
    avis: { type: String, required: false },
    cmdbl: { type: Boolean, required: false },
    ticketsbl: { type: Boolean, required: false }
}));