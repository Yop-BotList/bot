exports.run = async (client, message) => {
    message.channel.send({
        embed: {
            title: 'Grade Premium...',
            color: client.color,
            timestamp: new Date(),
            footer: {
                icon_url: message.author.displayAvatarURL(),
            },
            fields: [
                {
                    name: 'Obtention :',
                    value: 'Le grade <@&783375866452508692> ne peut pas être obtenu gratuitement. \nVous pouvez avoir ce rôle en invitant 10 personnes (_voir `+ranks`_) ou en "bumpant" le serveur 15 fois avec la commande `!d bump` (_voir `br.ranks`_).',
                    inline: false,
                },
                {
                    name: 'Avantages :',
                    value: '• Mention supplémentaire au bout d’une semaine d’ajout.\n• 2 bots.\n• Ajout d’un salon d’annonces dans le <#783013505225719829>.\n• Le grade <@&793543495599915069> pour tout vos bots.',
                    inline: false,
                }
            ],
        }
    });
}

exports.help = {
    name: "premium"
}