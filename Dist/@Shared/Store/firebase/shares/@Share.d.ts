import { MapView } from "./@MapView";
export declare enum ShareType {
    Map = 10
}
export declare class Share {
    constructor(initialData: Partial<Share>);
    _key: string;
    creator: string;
    createdAt: number;
    name: string;
    type: ShareType;
    mapID: string;
    mapView: MapView;
}
