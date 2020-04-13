import { SourceChain } from "./@SourceChain";
export declare class MediaAttachment {
    constructor(initialData?: Partial<MediaAttachment>);
    id: string;
    captured: boolean;
    previewWidth: number;
    sourceChains: SourceChain[];
}
