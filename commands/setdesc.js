const Discord = require('discord.js'),
      Database = require("easy-json-database");

const dbDesc = new Database('./database/description.json'),
      dbProprio = new Database('./database/proprio.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```setdesc <id bot> <description | none>```')
    }
    if (args[0].length != 18 && !isNaN(parseInt(args[0]))) {
        return message.channel.send(client.no + ' | Aïe ! Ton identifiant est invalide :confused:.')
    }else {
        if (!message.member.roles.get)
        const member = client.users.fetch(`${args[0]}`)
        if (!dbProprio.has(`Proprio_${member.user.id}`)) {
            return message.channel.send(client.no + ' | Désolé, mais je ne retrouve pas ce bot sur ma liste. (Ce n\'est d\'ailleurs peut-être même un bot)')
        }
        if (!args[1]) {
            return message.channel.send(client.no + ' | Il faudrai peut-être entrer une description non ?')
        }
        if (args[1] === 'none' && dbDesc.has(`Desc_${member.user.id}`)) {
            dbDesc.delete(`Desc_${member.user.id}`)
            return
        }
        if (args[1] === 'none' && !dbDesc.has(`Desc_${member.user.id}`)) {
            return message.channel.send(client.no + ' | Tu m\'as demandé supprimer une description que tu n\'as jamais enregistrée ¯\_(ツ)_/¯')
        }
        if (args[1] !== "none") {

        }
    }
}

exports.help = {
    name: "setdesc"
}