import { PermissionResolvable } from "discord.js";

export default interface CommandOptions {
    name: string,
    category?: string,
    description?: string,
    usage?: string,
    example?: string[],
    aliases?: string[],
    perms?: PermissionResolvable[],
    botPerms?: PermissionResolvable[],
    cooldown?: number,
    disabled?: boolean,
    owner?: boolean,
    minArgs?: number,
    requiredRole?: string 
}