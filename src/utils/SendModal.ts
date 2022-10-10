import axios from "axios";
import { ButtonInteraction, CommandInteraction, Interaction } from "discord.js";
import Class from "..";
import Modal from "./Modal";

export default async function SendModal(client: Class, interaction: CommandInteraction | ButtonInteraction, modal: Modal) {
    const apiUrl = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`;
    
    const headers = {
        'Authorization': `Bot ${client.token}`,
        'Content-Type': 'application/json'
    }

    try {
        await axios({
            method: 'post',
            url: apiUrl,
            headers: headers,
            data: {
                type: 9,
                data: modal.data
            }
        });
    } catch (error: any) {
        console.error(error.response);
    }
}