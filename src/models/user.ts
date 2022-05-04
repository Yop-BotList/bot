import { Schema, model } from "mongoose";

export default model("user", new Schema({
    userID: { type: String, required: false },
    avis: { type: String, required: false },
    cmdbl: { type: Boolean, required: false },
    ticketsbl: { type: Boolean, required: false },
    verifications: { type: Number, required: false }
}));