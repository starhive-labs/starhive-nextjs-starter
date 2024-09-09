export class JsonAttributeValue {
    readonly valueId: string
    readonly value: string
    readonly details?: any
    constructor(valueId: string, value: string, details?: object) {
        this.valueId = valueId;
        this.value = value;
        this.details = details;
    }
}
