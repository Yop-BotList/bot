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
    'user-agent': `yopbot/${require('../../../../package.json').version} (+https://github.com/Nonolanlan1007/Yop-Bot)`,
    'content-type': 'application/json; charset=utf-8'
}