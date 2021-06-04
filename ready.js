const { blue } = require('colors'),
      { botlogs } = require('../configs/channels.json'),
      { online } = require('../configs/emojis.json');

module.exports = (client) => {
    console.log(blue(`Je vient bien de me connecter à Discord !`) + "\n==================================================================")
    client.channels.cache.get(botlogs).send("**" + online + " | Je viens tout juste de me connecter !**")
}