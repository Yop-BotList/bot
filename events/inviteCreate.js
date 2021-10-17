'use strict';

const { staffGuildId, owner, owners, antiinvite } = require("../configs/config.json");

module.exports = async(client, invite) => {
    if (invite.guild.id !== staffGuildId) return;
    if (antiinvite === false) return;

    if (invite.inviter.id !== owner) return invite.delete();
    if (invite.inviter.id !== owner && !owners.includes(invite.inviter.id)) {
        invite.delete()
        try { client.users.cache.get(invite.inviter.id).send(`**${client.no} ➜ Désolé, mais vous n'avez pas l'autorisation de créer d'invitations sur ce serveur.**`) }
        catch { return }
        return;
    };
}