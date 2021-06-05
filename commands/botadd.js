const Discord = require('discord.js'),
      Database = require("easy-json-database")

const dbPrefix = new Database('./database/prefix.json'),
      dbProprio = new Database('./database/proprio.json'),
      dbVerifStatut = new Database('./database/verifstatut.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return console.log(args[0]) // message.channel.send('```y!botadd <id bot> <préfixe>```')
    }
    else if (message.mentions.members.first()) {
        return message.channel.send(client.no + ` | Désolé <@${message.author.id}>, mais je ne prends pas en charge les mentions. Essaies plutôt avec un identifiant !`)
    }
    else if (args[0].length === 18 && !isNaN(parseInt(args[0]))) {
        let prefix = '.'
        let proprio = '.'
        const member = await client.users.fetch(`${args[0]}`);
            if (member.bot) {
            if (dbProprio.has(`Proprio_${member.id}`)) {
                return message.channel.send(client.no + ' | Désolé, mais ce bot est déjà sur la liste.')
            } else {
                proprio = message.author.id
            }
    
            if (args[1]) {
                if(dbPrefix.has(`Prefix_${args[0]}`)) {
                    prefix = args[1]
                } else { 
                    prefix = args[1]
                }
            }
            else if (!args[1]) {
                return message.channel.send(client.no + ' | Il ne me semble pas que tu aies renseigné un préfixe...')
            }
        }
        else if (!member.bot) {
            return message.channel.send(client.no + ' | Le jour où les humains seront des bots, moi je porterais une culotte dans la rue !\nEssaie avec l\'identifiant d\'un bot :wink:')
        }
        if (prefix === '.') return;
        if (proprio === '.') return;
        
        // Création des variables :
        dbProprio.set(`Proprio_${member.id}`, `${proprio}`)
        dbPrefix.set(`Prefix_${member.id}`, `${prefix}`)
        dbVerifStatut.set(`Statut_${member.id}`, '.')
        //Message réponses
        client.channels.cache.get(client.botlogs).send(`<@${message.author.id}> / \`<@&782676062306959413>\``, {
            embed:{
                title: 'Demande d\'ajout...',
                timestamp: new Date(),
                thumbnail: member.displayAvatarURL(),
                color: '#66DA61',
                description: `<@${message.author.id}> a demandé à ajouter le bot [${member.username}#${member.discriminator}](https://discord.com/oauth2/authorize?client_id=${member.id}&scope=bot&permissions=0). Un vérificateur va bientôt s’occuper de lui.`
            }
        });
        message.channel.send(client.yes + ' | Votre bot a bien été ajouté à la liste d’attente. En attendant qu’un vérificateur s’occupe de lui, je vous invite à configurer son profil avec les commandes `y!setdesc`, `y!setsupport`, `y!setsite` ainsi que de voter pour lui avec la commande `y!like` !')
    } else if (args[0].length != 18 && !isNaN(parseInt(args[0]))) {
        return message.channel.send(client.no + ' | Aïe ! Ton identifiant est invalide :confused:.')
    }
}

exports.help = {
    name: "botadd",
    category: "botlist"
}