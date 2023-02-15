import { Schema, model } from "mongoose";

export default model("suggests", new Schema({
    against: {type: Number, required: true, default: 0},
    content: {type: String, required: true},
    for: {type: Number, required: true, default: 0},
    id: {type: Number, required: true},
    moderated: {type: Boolean, required: true, default: false},
    msgId: {type: String, required: true},
    userId: {type: String, required: true},
    voted: [{
        userId: {type: String, required: true},
        vote: {type: String, required: true}
    }]
}));