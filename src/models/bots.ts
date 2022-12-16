import { Schema, model } from "mongoose";

const reqString = { type: String, required: true },
    notReqString = { type: String, required: false };

export default model("bots", new Schema({
    botId: reqString,
    prefix: reqString,
    ownerId: reqString,
    verified: { type: Boolean, required: false },
    supportInvite: notReqString,
    site: notReqString,
    description: notReqString,
    likes: { type: Number, required: false },
    latestLikeDate: { type: Date, required: false },
    team: { type: [String], required: false },
    checked: { type: Boolean, required: false, default: true },
    avatar: { type: String, required: false, default: "https://cdn.discordapp.com/embed/avatars/0.png" },
    username: { type: String, required: false },
    serverCount: { type: Number, required: false, default: 0 },
    userCount: { type: Number, required: false, default: 0 },
    shardCount: { type: Number, required: false, default: 0 },
    latestStatsUpdate: { type: Date, required: false },
    tags: { type: [String], required: false },
    voteHook: { type: String, required: false },
    hookCode: { type: String, required: false },
    receiveBugs: { type: Boolean, required: false },
    bugThread: notReqString,
    bugs: [{
        submitter: notReqString,
        status: { type: Number, required: false },
        /*
        Différents status des bugs :
        0 : Envoyé au développeur
        1 : Vu par le développeur, recherche de l'origine du bug en cours.
        2 : Résolution du bug en cours.
        3 : Bug patché lors de la prochaine mise à jour;
        4 : Bug corrigé.
         */
        msgId: notReqString
    }]
}));
