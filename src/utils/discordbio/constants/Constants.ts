export const bioOptionsDefaults = {
    rest: {
        'base_url': 'https://discords.com/bio/api',
        cdn_url: 'https://cdn.discordapp.com',
    },
    scrapper: {
        base_url: 'https://discords.com/bio'
    },
    enableCaching: false
}
export type Headers = {
    [key: string]: string | undefined
}
export const headers: Headers = {
    'user-agent': `discord.bio/${require('../../package.json').version} (+https://github.com/asdfugil/discord.bio)`,
    'content-type': 'application/json; charset=utf-8'
}