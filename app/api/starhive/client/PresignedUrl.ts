export class PresignedUrl {
    readonly presignedUrl: string
    readonly contentKey: string

    constructor(presignedUrl: string, contentKey: string) {
        this.presignedUrl = presignedUrl;
        this.contentKey = contentKey;
    }
}
