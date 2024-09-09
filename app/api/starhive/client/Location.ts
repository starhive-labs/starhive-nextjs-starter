export class Location {
    readonly address: string
    readonly latitude: number
    readonly longitude: number

    constructor(address: string, latitude: number, longitude: number) {
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
