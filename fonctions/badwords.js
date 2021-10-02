const { bypass } = require("../configs/roles.json"),
      { modlogs } = require("../configs/channels.json"),
      badwords = require("../utils/badwords.json")

badWords = module.exports = async (message) => {
    if (message.member.roles.has(bypass)) return;
    
}