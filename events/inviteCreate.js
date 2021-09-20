const { staffGuildId, owner } = require("../configs/config.json");

module.exports = async (client, invite) => {
    if (invite.guild.id !== staffGuildId) return;

    if (invite.inviter.id !== owner) return invite.delete();
}
