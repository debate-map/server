export declare class SourceChain {
    constructor(sources?: Source[]);
    sources: Source[];
}
export declare enum SourceType {
    Speech = 10,
    Text = 20,
    Image = 30,
    Video = 40,
    Webpage = 50
}
export declare const Source_linkURLPattern = "^https?://[^\\s/$.?#]+\\.[^\\s]+$";
export declare class Source {
    type: SourceType;
    name: string;
    author: string;
    location: string;
    time_min: number;
    time_max: number;
    link: string;
}
export declare function GetSourceNamePlaceholderText(sourceType: SourceType): "speech name" | "book/document name" | "image name" | "video name";
export declare function GetSourceAuthorPlaceholderText(sourceType: SourceType): "speaker" | "book/document author" | "image author" | "video author" | "webpage author";
