import type {
    Collection,
    Message,
    DMChannel,
    PartialDMChannel,
    TextBasedChannel,
    AttachmentBuilder
} from 'discord.js';

export type ReturnTypes = 'buffer' | 'string' | 'attachment';

export type ObjectType<T> = 
    T extends 'buffer' ? Buffer
    : T extends 'string' ? string
    : T extends 'attachment' ? AttachmentBuilder
    : AttachmentBuilder;

export type GenerateFromMessagesOpts = {
    returnType?: ReturnTypes;
    fileName?: string;
    minify?: boolean;
    saveImages?: boolean;
    useCDN?: boolean;
};

export type GenerateSource = Collection<string, Message> | Message[];

export type CreateTranscriptOptions = GenerateFromMessagesOpts & {
    limit?: number;
};

export type internalGenerateOptions = {
    returnBuffer?: boolean;
    returnType?: ReturnTypes;
    fileName?: string;
    minify?: boolean;
    saveImages?: boolean;
    useCDN?: boolean;
};

export type ValidTextChannels = Exclude<
    TextBasedChannel,
    DMChannel | PartialDMChannel
>;

export type Class<T> = new (...args: any[]) => T;

export type ReturnTypeWrapper<T> = 
    T extends GenerateFromMessagesOpts ? 
        T["returnType"] extends undefined 
            ? AttachmentBuilder
            : ObjectType<T["returnType"]>
        : AttachmentBuilder