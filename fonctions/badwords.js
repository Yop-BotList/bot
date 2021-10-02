const { bypass } = require("../configs/roles.json"),
      { modlogs } = require("../configs/channels.json"),
      badwords = require("../utils/badwords.json")

badWords = module.exports = async (message) => {
    if (message.member.roles.has(bypass)) return;
    let text = message.content;
    
    // French 
    badwords.french.forEach(x => {
        let size = x.length;
        text = text.toLowerCase();
        text = text.replace(x, "\*".repeat(size)).then(() => { const content = true });
    });

    // English 
    badwords.english.forEach(x => {
        let size = x.length;
        text = text.toLowerCase();
        text = text.replace(x, "\*".repeat(size)).then(() => { const content = true });
    });

   
}
