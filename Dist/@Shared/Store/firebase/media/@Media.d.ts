export declare enum MediaType {
    Image = 10,
    Video = 20
}
export declare function GetNiceNameForMediaType(type: MediaType): string;
export declare class Media {
    constructor(initialData: {
        name: string;
        type: MediaType;
    } & Partial<Media>);
    _key: string;
    creator: string;
    createdAt: number;
    name: string;
    type: MediaType;
    url: string;
    description: string;
}
export declare const Media_namePattern = "^[a-zA-Z0-9 ,'\"%\\-()\\/]+$";
