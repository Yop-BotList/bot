import { blue } from 'colors';

module.exports = async (client) => {
  console.log(blue(`[BOT] Connecté en tant que ${client.user.tag}`));
}