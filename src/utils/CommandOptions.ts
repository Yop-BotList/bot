export default interface CommandOptions {
    name: string,
    category: string,
    description: string,
    usage: string,
    example: string[],
    aliases: string[],
    perms: string[],
    botPerms: string[],
    cooldown: number,
    disabled: boolean
}