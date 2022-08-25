import axios from "axios";
import { Interaction } from "discord.js";
import Class from "..";
import Modal from "./Modal";

export default async function SendModal(client: Class, interaction: Interaction, modal: Modal) {
    const apiUri = 'https://discord.com/api/v10/interactions/{interaction_id}/{interaction_token}/callback';
    
    const uri = apiUri.replace('{interaction_id}', interaction.id).replace('{interaction_token}', interaction.token);
    
    const headers = {
        'Authorization': `Bot ${client.token}`,
        'Content-Type': 'application/json'
    }

    try {
        await axios({
            method: 'post',
            url: uri,
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