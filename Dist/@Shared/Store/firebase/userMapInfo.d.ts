export declare const GetUserMapInfo: ((userID: string, mapID: string) => import("@debate-map/server-link/Source/Link").UserMapInfo) & {
    Wait: (userID: string, mapID: string) => import("@debate-map/server-link/Source/Link").UserMapInfo;
};
export declare const GetUserLayerStatesForMap: ((userID: string, mapID: string) => import("@debate-map/server-link/Source/Link").LayerStatesMap) & {
    Wait: (userID: string, mapID: string) => import("@debate-map/server-link/Source/Link").LayerStatesMap;
};
export declare const GetUserLayerStateForMap: ((userID: string, mapID: string, layerID: string) => any) & {
    Wait: (userID: string, mapID: string, layerID: string) => any;
};
