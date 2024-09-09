export class ContentMetadata {
    readonly fileName: string
    readonly fileSizeInBytes: number
    readonly httpContentType: string

    constructor(fileName: string, fileSizeInBytes: number, httpContentType: string) {
        this.fileName = fileName;
        this.fileSizeInBytes = fileSizeInBytes;
        this.httpContentType = httpContentType;
    }
}
