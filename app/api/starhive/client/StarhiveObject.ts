import {AttributeVisitor} from "./AttributeVisitor";

export interface StarhiveObject {
    getId(): string | undefined

    getTypeId(): string

    accept(visitor: AttributeVisitor): void
}
