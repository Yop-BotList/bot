import { Collection, Message, TextBasedChannel } from 'discord.js';
import exportHtml from './exportHtml';
import { GenerateSource, GenerateFromMessagesOpts, CreateTranscriptOptions, ValidTextChannels, ReturnTypeWrapper, } from './types';
import { castToType, optsSetup } from './utils';

export function generateFromMessages<T extends GenerateFromMessagesOpts = {}>(messages: GenerateSource, channel: ValidTextChannels, opts?: T): Promise<ReturnTypeWrapper<T>> {
    var options: GenerateFromMessagesOpts = optsSetup(opts, channel);

    if (messages instanceof Collection) messages = Array.from(messages.values());

    if (!Array.isArray(messages)) throw new Error('Provided messages must be either an array or a collection of Messages.');

    if (messages.length === 0) return exportHtml(messages, channel, options) as any;

    if (!(messages[0] instanceof Message)) throw new Error('Provided messages does not contain valid Messages.');

    return exportHtml(messages, channel, options) as any;
};

export async function createTranscript<
    T extends CreateTranscriptOptions = {}
>(
    channel: ValidTextChannels,
    opts?: T
): Promise<ReturnTypeWrapper<T>> {
    const options: CreateTranscriptOptions = optsSetup(opts, channel);

    if (!('limit' in options)) options.limit = -1;

    if (!channel) throw new TypeError('Provided channel must be a valid channel.');

    if (!channel || (typeof castToType<TextBasedChannel>(channel).isTextBased === 'function' && !castToType<TextBasedChannel>(channel).isTextBased())) throw new TypeError('Provided channel must be a valid channel.');

    const sum_messages: Message[] = [];
    var last_id: string | undefined;

    while (true) {
        var fetchOptions = { limit: 100, before: last_id };
        if (!last_id) delete fetchOptions['before'];

        const messages = await channel.messages.fetch(fetchOptions);
        sum_messages.push(...Array.from(messages.values()));
        last_id = messages.last()?.id;

        if (messages.size != 100 || (sum_messages.length >= options.limit! && options.limit! != -1)) break;
    }

    return await exportHtml(sum_messages, channel, options) as any;
};