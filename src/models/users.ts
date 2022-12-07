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
            date: { type: Number, required: false, default: Date.now() },
            deleted: { type: Boolean, required: false, default: false },
            historyLogs: [
                {
                    title: { type: String, required: false, default: "Action inconnue" },
                    mod: { type: String, required: false },
                    date: { type: Number, required: false }
                }
            ]
        }
    ],
    totalNumbers: { type: Number, required: false, default: 0 },
    readFaq: { type: Boolean, required: false, default: false },
    locale: { type: String, required: false },
    lastVoteDate: { type: Number, required: false },
    badges: [
        {
            id: { type: String, required: false, default : "dev" },
            acquired: { type: Boolean, required: false, default: false },
        }, {
            id: { type: String, required: false, default : "partner" },
            acquired: { type: Boolean, required: false, default: false },
        }, {
            id: { type: String, required: false, default : "premium" },
            acquired: { type: Boolean, required: false, default: false },
        }, {
            id: { type: String, required: false, default : "staff" },
            acquired: { type: Boolean, required: false, default: false },
        }, {
            id: { type: String, required: false, default : "support" },
            acquired: { type: Boolean, required: false, default: false },
        }, {
            id: { type: String, required: false, default : "verificator" },
            acquired: { type: Boolean, required: false, default: false },
        }
    ]
}));
