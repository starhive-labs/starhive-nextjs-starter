export class User {
    readonly id: string
    readonly name: string
    readonly email: string

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
