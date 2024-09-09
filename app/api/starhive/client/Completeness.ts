export class Completeness {
    readonly value: number
    readonly missingDependees: string[]
    readonly completedDependees: string[]

    constructor(value: number, missingDependees: string[], completedDependees: string[]) {
        this.value = value;
        this.missingDependees = missingDependees;
        this.completedDependees = completedDependees;
    }
}
