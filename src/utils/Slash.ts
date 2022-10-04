import { ApplicationCommandOptionData, ApplicationCommandType, Awaitable, CacheType, CommandInteraction, LocalizationMap, PermissionResolvable } from "discord.js";
import Class from "..";

export default abstract class Slash {
    readonly type: number;
    name: string;
    name_localizations: Partial<Record<"en-US" | "en-GB" | "bg" | "zh-CN" | "zh-TW" | "hr" | "cs" | "da" | "nl" | "fi" | "fr" | "de" | "el" | "hi" | "hu" | "it" | "ja" | "ko" | "lt" | "no" | "pl" | "pt-BR" | "ro" | "ru" | "es-ES" | "sv-SE" | "th" | "tr" | "uk" | "vi", string | null>> | undefined;
    description: string;
    description_localizations: Partial<Record<"en-US" | "en-GB" | "bg" | "zh-CN" | "zh-TW" | "hr" | "cs" | "da" | "nl" | "fi" | "fr" | "de" | "el" | "hi" | "hu" | "it" | "ja" | "ko" | "lt" | "no" | "pl" | "pt-BR" | "ro" | "ru" | "es-ES" | "sv-SE" | "th" | "tr" | "uk" | "vi", string | null>> | undefined;
    options: ApplicationCommandOptionData[] | undefined;
    default_member_permissions: any | undefined;
    dm_permission: boolean | undefined;

    constructor(data: SlashData) {
        this.type = ApplicationCommandType.ChatInput;
        this.name = data.name;
        this.name_localizations = data.name_localizations;
        this.description = data.description;
        this.description_localizations = data.description_localizations;
        this.options = data.options;
        this.default_member_permissions = data.default_member_permissions;
        this.dm_permission = data.dm_permission;
    }

    abstract run(client: Class, interaction: CommandInteraction): Awaitable<unknown>
}

interface SlashData {
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    options?: ApplicationCommandOptionData[];
    default_member_permissions?: PermissionResolvable;
    dm_permission?: boolean
}