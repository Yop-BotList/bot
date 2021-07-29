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
                    value: "Le grade <@&783375866452508692> ne peut pas être obtenu gratuitement.\n Pour l'obtenir, vous devez le gagner lors d'un giveaway. Si vous êtes l'un de nos <@&784745567032573973> ou <@&828572424211398716> *(voir <#828531510772367391>)*, vous bénéfieciez aussi des avantages !",
                    inline: false,
                },
                {
                    name: 'Avantages :',
                    value: '• 2 bots.\n• Ajout d’un salon d’annonces dans le <#783013505225719829>*(seulement pour les 10 premiers)*.\n• Le grade <@&793543495599915069> pour tout vos bots.\n• La possibilité de changer son pseudo.\n• La possibilité de créer des threads dans certains salons.',
                    inline: false,
                }
            ],
        }
    });
}

exports.help = {
    name: "premium",
    category: "utils",
    description: "Recevoir des informations sur rôle <@&783375866452508692>",
    usage: "premium",
    example: ["premium"]
}
