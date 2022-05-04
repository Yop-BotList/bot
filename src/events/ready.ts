import { blue } from 'colors';
import Class from '..';

module.exports = async (client: Class) => {
  console.log(blue(`[BOT] Connecté en tant que ${client.user?.tag}`));
  client.postSlashs(client.slashs);
}