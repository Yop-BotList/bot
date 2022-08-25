import { Schema, model } from "mongoose";

export default model("users", new Schema({
    userId: { type: String, required: false },
    avis: { type: String, required: false },
    cmdbl: { type: Boolean, required: false },
    ticketsbl: { type: Boolean, required: false },
    warns: [
        {
            id: { type: Number, required: false },
            userId: { type: String, required: false },
            modId: { type: String, required: false },
            type: { type: String, required: false },
            reason: { type: String, required: false },
            duration: { type: Number, required: false },
            finishOn: { type: Number, required: false },
            date: { type: Number, required: false }
        }
    ],
    totalNumbers: { type: Number, required: false, default: 0 },
    readFaq: { type: Boolean, required: false, default: false }
}));