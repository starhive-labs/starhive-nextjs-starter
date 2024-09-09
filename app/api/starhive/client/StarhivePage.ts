export class StarhivePage<T> {
    readonly total: number
    readonly pageSize: number
    readonly isLast: boolean
    readonly result: T[]

    constructor(total: number, pageSize: number, isLast: boolean, result: T[]) {
        this.total = total
        this.isLast = isLast
        this.pageSize = pageSize
        this.result = result
    }
}
