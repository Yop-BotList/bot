import { Collection, Message } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import Class from "..";

export default function onCooldown(client: Class, message: Message, command: any): string | false {
    if(!message || !client) throw "No Message with a valid DiscordClient granted as First Parameter";
    if(!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
    if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = command.cooldown * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = prettyMilliseconds(expirationTime - now, { compact: true });

        return timeLeft
      }
      else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        return false;
      }
    }
    else {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      return false;
    }
}
