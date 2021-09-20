const { staffGuildId, owner } = require("../configs/config.json"),
    client = require("../index");

client.on("inviteCreate", async (client, invite) => {
    if (invite.guild.id !== staffGuildId) return;

    if (invite.inviter.id !== owner) return invite.delete();
});
