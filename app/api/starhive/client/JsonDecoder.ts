import {StarhiveObject} from "./StarhiveObject";
import {JsonAttributeValue} from "./JsonAttributeValue";

export interface JsonDecoder<T extends StarhiveObject> {
    setId(id: string): void

    visitJsonAttribute(attributeId: string, values: JsonAttributeValue[]): void

    build(): T
}
