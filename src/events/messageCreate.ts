import { ChannelType, Message } from "discord.js";
import Class from "..";
import { channels } from "../configs";
import execCommand from "../functions/execCommand";
import { counter, users as user } from "../models";
import moment from 'moment';
import { existsSync, readFileSync, writeFile } from "fs";
import { join } from "path";
import TicketsDM from "../functions/ticketsDM";
import citations from "../functions/citations";
import AutoMod from "../utils/AutoMod";

moment.locale("fr");

export = async (client: Class, message: Message) => {
    if (message.author.bot) return;

    new AutoMod(client, message);

    const ticketsManager = new TicketsDM(client, message);

    if (message.channel.isDMBased()) return ticketsManager.clientSide();

    if (message.channel.name.startsWith("🎫・ticket-")) return ticketsManager.serverSide();

    const data = await user.findOne({ userId: message.author.id })
    if (!data) new user({
        userId: message.author.id,
        avis: null,
        cmdbl: false,
        ticketsbl: false,
        warns: [],
        totalNumbers: 0
    }).save()

    if (message.channelId === channels.counter) {
        message.delete()
        const counterDb = await counter.findOne();

        if (!counterDb || !counterDb.counter) {
            if (Number(message.content) !== 1) return message.author.send(`**${client.emotes.no} ➜ Le prochain nombre est 1.**`);

            new counter({
                counter: 1,
                lastCountUser: message.author.id
            }).save();
        } else {
            if (counterDb.lastCountUser === message.author.id) return message.author.send(`**${client.emotes.no} ➜ Vous êtes déjà le dernier utilisateur a avoir envoyé un nombre. Veuillez patienter...**`);
            if (Number(message.content) !== counterDb.counter + 1) return message.author.send(`**${client.emotes.no} ➜ Le prochain nombre est ${counterDb.counter + 1}.**`);

            let actual = 100;
            let next = 100;
            client.counterObjectifs.map((x: number, index: number) => {
                x === Number(message.content) ? actual = x : 100;
                x === Number(message.content) ? next = client.counterObjectifs[index + 1] : 100;
            });

            if (client.counterObjectifs.includes(Number(message.content))) message.channel.send({ content: `**🎉 ➜ Objectif atteint, nombre actuel: ${actual} prochain objectif: ${next} !**` });

            counterDb.counter = Number(message.content);
            counterDb.lastCountUser = message.author.id;
            counterDb.save();
        }

        const userGet = await user.findOne({ userId: message.author.id });

        if (!userGet) new user({
            userId: message.author.id,
            totalNumbers: 1
        }).save();
        else {
            userGet.totalNumbers = !userGet.totalNumbers ? 1 : userGet.totalNumbers + 1;
            userGet.save();
        }

        return message.channel.send({
            embeds: [
                {
                    author: {
                        name: message.author.username,
                        icon_url: message.author.displayAvatarURL()
                    },
                    description: `Nombre actuel : ${message.content}`,
                    color: client.config.color.integer
                }
            ]
        });
    }

    // funny system
    if (message.content === `<@${client.user?.id}>`) {
        if (client.config.owners.includes(message.author.id)) return message.reply(`**${client.emotes.discordicons.wave} ➜ Bonjour maître ! Comment allez-vous ?**`);
        else return message.reply(`**${client.emotes.discordicons.wave} ➜ Bonjour, suis YopBot ! Mon préfixe est \`${client.config.prefix}\` mais sinon, vous pouvez utiliser mes commandes slash !**`);
    }

    if (message.content.includes(`${client.user?.username}`)) message.react("👀");

    if (message.content.includes("discord.com/channels/")) citations(client, message);

    /* Command System */

    if (!message.content.startsWith(client.config.prefix)) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const cmdName = args.shift()?.toLowerCase();
    const command = client.commands.find(cmd => (cmd.name === cmdName) || cmd.aliases.includes(cmdName));

    if (!command) return;

    let db = await user.findOne({ userID: message.author.id, cmdbl: true });
    if (db) return message.reply({ content: `**${client.emotes.no} ➜ Vous êtes sur la liste noire des commandes. Vous ne pouvez donc pas en utiliser.**` });

    const userCmds = existsSync(`./logs/commands/${message.author.id}.txt`) ? readFileSync(`./logs/commands/${message.author.id}.txt`) : null;

    const newText = userCmds !== null ? userCmds + `\n\n[${moment(Date.now()).format("DD/MM/YYYY kk:mm:ss")}] [${message.guild!.id} - ${message.guild!.name}] [${message.channel.id} - ${message.channel.name}] [${message.id}] - ${message.content}` : `${message.author.id} - ${message.author.tag} - ${moment(message.author.createdAt).format("DD/MM/YYYY kk:mm:ss")}\n\n-------------------------------------------------------------------------------------------------------------------------\n\n` + `[${moment(Date.now()).format("DD/MM/YYYY kk:mm:ss")}] [${message.guild!.id} - ${message.guild!.name}] [${message.channel.id} - ${message.channel.name}] [${message.id}] - ${message.content}`;

    writeFile(`./logs/commands/${message.author.id}.txt`, newText, (err) => {
        if (err) console.log(err.stack);
    });

    try {
        execCommand(command, client, message, args)
    } catch (err) {
        message.reply({
            embeds: [
                {
                    title: 'Une erreur est survenue',
                    description: '```js\n' + err + '```',
                    footer: {
                        text: moment(Date.now()).format('DD_MM_YYYY_kk_mm_ss_ms')
                    }
                }
            ]
        });
    }
}
