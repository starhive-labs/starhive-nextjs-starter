import {OptionValue} from "./OptionValue";
import {Location} from "./Location";
import {User} from "./User";
import {WorkflowState, WorkflowTransition} from "./Workflow";

export interface AttributeVisitor {
    visitTextAttribute(attributeId: string, values: string[] | undefined): void

    visitIntegerAttribute(attributeId: string, values: number[] | undefined): void

    visitDecimalAttribute(attributeId: string, values: number[] | undefined): void

    visitBooleanAttribute(attributeId: string, values: boolean[] | undefined): void

    visitDatetimeAttribute(attributeId: string, values: Date[] | undefined): void

    visitDateAttribute(attributeId: string, values: Date[] | undefined): void

    visitOptionAttribute(attributeId: string, values: OptionValue[] | undefined): void

    visitURLAttribute(attributeId: string, values: URL[] | undefined): void

    visitReferenceAttribute(attributeId: string, values: string[] | undefined): void

    visitLocationAttribute(attributeId: string, values: Location[] | undefined): void

    visitIpAddressAttribute(attributeId: string, values: string[] | undefined): void

    visitEmailAttribute(attributeId: string, values: string[] | undefined): void

    visitUserAttribute(attributeId: string, values: User[] | undefined): void

    visitWorkflowAttribute(attributeId: string, value: WorkflowState | undefined, transition: WorkflowTransition | undefined): void
}
