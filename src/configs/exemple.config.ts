export default {
    token: "Token",
    prefix: "y/",
    mongooseConnectionString: "URL Mongo",
    color: {
        hexa: "#f2ac34",
        integer: 0xf2ac34
    },
    autokick: true,
    staffGuildId: "839895687340753026",
    owners: [
        "692374264476860507",
        "650664078649458699",
        "458218450393890831"
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
    },
    mega: {
        email: "email", // Ces identifiants sont les identifiants d'accès à votre compte Mega (https://mega.io)
        password: "password" // Remplacez par "" pour désactiver la sauvegarde de la base de données
    },
    DiscordAnalytics: "token"
};
