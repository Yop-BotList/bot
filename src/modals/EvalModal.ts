import { CommandInteraction, ModalSubmitInteraction } from "discord.js";
import Class from "..";
import Modal from "../utils/Modal";
import TextInput from "../utils/TextInput";

export default class EvalModal extends Modal {
    constructor() {
        super({
            title: "Eval Modal", 
            customId: "eval_modal",
            components: [
                {
                    type: 1,
                    components: [
                        new TextInput({
                            customId: "evaluationCode",
                            placeholder: "console.log('bonjour')",
                            required: true,
                            label: "Que dois-je évaluer ?",
                            style: 2
                        })
                    ]
                }
            ]
        });
    }
    
    
    async handleSubmit(client: Class, interaction: CommandInteraction) {
        await interaction.awaitModalSubmit({
            time: 120000,
            filter: (modal: ModalSubmitInteraction) => modal.customId === "eval_modal"
        }).then(async (modal: ModalSubmitInteraction) => {
            let code = modal.fields.getTextInputValue("evaluationCode");
            
            if (!code) return modal.reply({
                content: `**${client.emotes.no} ➜ Merci de répondre correctement au modal.**`,
                ephemeral: true
            });
            
            let result = "";
            
            try {
                result = await eval(code);
            } catch (error: any) {
                result = await error.message;
            }
            
            if (code.length > 1024) code = code.substring(0, 1021) + "...";
            if (result.length > 1024) result = result.substring(0, 1021) + "...";
            
            if (code.toLowerCase().includes('token') || result.includes(client.config.token) || code.toLowerCase().includes("token")) return modal.reply({
                content: `**${client.emotes.no} ➜ Vous ne pouvez pas utiliser le token du bot.**`,
                ephemeral: true
            });
            if (code.toLowerCase().includes("client.destroy()")) return modal.reply({
                content: `**${client.emotes.no} ➜ Vous ne pouvez pas utiliser la commande \`client.destroy()\`.**`,
                ephemeral: true
            });
            if (code.toLowerCase().includes("roles.remove") || code.toLowerCase().includes("roles.add")) return modal.reply({
                content: `**${client.emotes.no} ➜ Vous ne pouvez pas utiliser les commandes \`roles.remove\` et \`roles.add\`.**`,
                ephemeral: true
            });
            if (code.toLowerCase().includes(client.config.mongooseConnectionString) || result.includes(client.config.mongooseConnectionString) || code.toLowerCase().includes("mongooseConnectionString") ) return modal.reply({
                content: `**${client.emotes.no} ➜ Vous ne pouvez pas utiliser l'url de connexion de mongodb.**`,
                ephemeral: true
            });
            
            modal.reply({
                embeds: [
                    {
                        title: "Évaluation d'un code en Javascript :",
                        color: client.config.color.integer,
                        thumbnail: {
                            url: modal.user.displayAvatarURL()
                        },
                        timestamp: new Date().toISOString(),
                        fields: [
                            {
                                name: "➜ Entrée :",
                                value: "```js\n" + code + "```"
                            }, {
                                name: "➜ Sortie :",
                                value: "```js\n" + result + "```"
                            }
                        ]
                    }
                ]
            });
        });
    }
}