export class FileDetail {
    fileName: string = "";
    fileSize: number = 0;
    fileType: string = "";
    lastModifiedTime: number = 0;
    lastModifiedDate!: Date;
    fileAsBase64: string = "";
}
