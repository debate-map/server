export declare class MapNodePhrasing {
    constructor(initialData: {
        node: string;
    } & Partial<MapNodePhrasing>);
    _key?: string;
    creator: string;
    createdAt: number;
    node: string;
    type: MapNodePhrasingType;
    text: string;
    description: string;
}
export declare enum MapNodePhrasingType {
    Precise = 10,
    Natural = 20
}
