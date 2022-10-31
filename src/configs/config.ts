export default {
    token: "token",
    prefix: "y/",
    mongooseConnectionString: "mongodb",
    color: {
        hexa: "#f2ac34",
        integer: 0xf2ac34
    },
    autokick: true,
    staffGuildId: "839895687340753026",
    owners: [
        "692374264476860507",
        "650664078649458699"
    ],
    mainguildid: "839895687340753026",
    antiinvite: true,
    citations: true,
    automod: {
        ignoreBots: true,
        ignoreStaff: true,
        maxMessages: {
            antispam: 10,
            antilink: 10,
            antiinvites: 5,
            massmentions: 5
        },
        badwords: ["con", "connard", "pute", "fdp", "geule", "connasse", "merde", "chier", "chiant", "chiante", "nique", "niquer", "salop", "salope", "salopard", "ntm"]
    }
};