export default class TextInput {
    type: number = 4;
    custom_id: string;
    style: any;
    label: string;
    min_length: number | undefined;
    max_length: number | undefined;
    required: boolean;
    value: string | undefined;
    placeholder: string | undefined;

    constructor(options: TextInputData) {
        this.type = 4;
        this.custom_id = options.customId;
        this.style = options.style;
        this.label = options.label;
        this.min_length = options?.minLength;
        this.max_length = options?.maxLength;
        this.required = options?.required ?? false;
        this.value = options?.value;
        this.placeholder = options?.placeholder;
    }
}

interface TextInputData {
    customId: string;
    style: any;
    label: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}