'use strict';
const {blue, green} = require('colors'),
       Discord = require('discord.js'),
       checkBump = require('../fonctions/checkbump.js'),
       config = require('../config.json');

module.exports = async(client) => {
    client.user.setActivity('y!help | By Nolhan#2508')
    client.on("message", message => {
        if (message.content.startsWith(config.prefix)) {
            setTimeout(() => {
            client.reloadCommand('botadd')
            client.reloadCommand('botprofil')
            client.reloadCommand('accept')
            client.reloadCommand('reject')
            client.reloadCommand('avis')
            client.reloadCommand('ticket-add')
            client.reloadCommand('ticket-close')
            client.reloadCommand('ticket-new')
            client.reloadCommand('ticket-remove')
            client.reloadCommand('like')
            }, 3000)
        }
        if (message.content.startsWith('!d bump')) {
            console.log('test réussi !')
        }
    });
    console.log(`Connecté en tant que ${blue(`${client.user.tag}`)}`);
    const activities = [`y!help | By Nolhan#2508`, 'y!help | By Nolhan#2508'];
    setInterval(async () => {
            await client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]);
            }, 120000);
};