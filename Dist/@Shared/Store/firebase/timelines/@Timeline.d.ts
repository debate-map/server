export declare class Timeline {
    constructor(initialData: {
        name: string;
        creator: string;
    } & Partial<Timeline>);
    _key: string;
    creator: string;
    createdAt: number;
    mapID: string;
    name: string;
    videoID: string;
    videoStartTime: number;
    videoHeightVSWidthPercent: number;
    steps: string[];
}
