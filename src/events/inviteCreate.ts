import { Invite } from "discord.js";
import Class from "..";
import { config, emotes } from "../configs"

module.exports = async(client: Class, invite: Invite) => {
    if (invite.guild!.id !== config.staffGuildId) return;
    if (config.antiinvite === false) return;

    if (!config.owners.includes(invite.inviter!.id)) {
        invite.delete()
        try { client.users.cache!.get(invite.inviter!.id)!.send(`**${emotes.no} ➜ Désolé, mais vous n'avez pas l'autorisation de créer d'invitations sur ce serveur.**`) }
        catch { return }
        return;
    };
}