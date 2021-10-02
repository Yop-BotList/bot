const { Client } = require("discord.js"),
  { glob } = require("glob"),
  { promisify } = require("util"),
  globPromise = promisify(glob),
  { readdirSync } = require("fs"),
  { red } = require('colors'),
  ascii = require("ascii-table"),
  table1 = new ascii("Commandes"),
  table2 = new ascii("Évènements")
  table1.setHeading("Commande", "Statut", "Commandes Slash");
  table2.setHeading("Évènement", "Statut")

/**
 * @param {Client} client
 */

module.exports = async (client) => {
  
  // slashcommands start
  const slashCommands = await globPromise(
    `${process.cwd()}/slashCommands/**/*.js`
  );

  const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if(['MESSAGE', 'USER'].includes(file.type)) delete file.description;
        if(file.userPermissions) file.defaultPermission = false;
        arrayOfSlashCommands.push(file);
    });

  client.on("ready", async () => {
    client.guilds.cache.forEach(async (g) => {
      await client.application.commands.set(arrayOfSlashCommands);
      async (commandNames) => {
        const permissions = arrayOfSlashCommands.find((x) => x.name === commandName).userPermissions;

        if(!permissions) return null;
        return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed);
        
        const fullPermissions = cmd.reduce((accumulator, x) => {
          const roles = getroles(x.name);
          if(!roles) return accumulator;

          const permissions = roles.reduce((a, v) => {
            return [
              ...a,
              {
              id: v.id,
              type: 'ROLE',
              permission: true
              },
            ];
          }, []);

          return [
            ...accumulator,
            {
              id: x.id,
              permissions,
            },
          ];
        }, []);

        guild.commands.permissions.set({ fullPermissions });
      };
    });
  });


  // commandes
  try {
    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );
      for (let file of commands) {
        let pull = require(`../commands/${dir}/${file}`);
        if (pull.name) {
          client.commands.set(pull.name, pull);
          if (client.slashCommands.get(pull.name)) var sc = "Prête"
          if (!client.slashCommands.get(pull.name)) var sc = "Non chargée"
          table1.addRow(file, "Prête", sc);
        } else {
          table1.addRow(
            file, "Non chargée", sc);
          continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull));
      }
    });
    console.log(table1.toString().cyan);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }

  // events start
  readdirSync("./events/").forEach((file) => {
    const events = readdirSync("./events/").filter((file) =>
      file.endsWith(".js")
    );
    for (let file of events) {
      let pull = require(`../events/${file}`);
      if (pull.name) {
        client.events.set(pull.name, pull);
      }
    }
    console.log((`Évènement ${file} chargé avec succès !`));
  });
};
