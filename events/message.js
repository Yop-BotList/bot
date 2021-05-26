'use strict';
const {blue, green} = require('colors'),
       Discord = require('discord.js'),
       Database = require('easy-json-database'),
       dbProprio = new Database('./database/proprio.json'),
       dbCooldown = new Database('./database/cooldown.json'),
       date = new Date();
module.exports = (client, message) => {
    if (!message.channel.guild) {
        return ;
    }

    const data = message.content;

    const args = data.slice(client.prefix.length).trim().split(/ +/g);

    if (!data.startsWith(client.prefix)) {
        return;
    }

    const command = client.commands.find(cmd => cmd.aliases.includes(args[0])) || client.commands.get(args[0]);
    if (!command) {
        return ;
    }
    if(command.botNotAllowed && message.author.bot) {
        return;
    }

    if(command.perms === "owner") {
        if(!client.config.owners.includes(message.author.id)) {
            return message.channel.send(':no_entry_sign: Vous n\'avez pas l\'autorisation d\'utiliser cette commande.');
        }
    }
     else if(command.perms !== 'everyone') {
        if(!message.member.permission.has(command.perms)) {
            return message.channel.send(':no_entry_sign: Vous n\'avez pas l\'autorisation d\'utiliser cette commande.');
        }
    }
     if(command.botPerms !== []) {
         for(botPerm of command.botPerms) {
             if(!message.guild.members.cache.get(client.user.id).hasPermission(botPerm)) {
                 let perms = []
                 for(perm of command.botPerms) {
                    perms.push(`\`${perm}\``);
                 }
                 return message.channel.send(`:no_entry_sign: Je n\'ai pas la/les permission(s) nécessaire(s) pour exécuter cette commande\nPermissions manquantes : ${perms.join("\n")}`);
             }
         }
     }

    try {
        command.run(client, message, args)
    } catch (err) {
       client.emit('error',err);
    }
};