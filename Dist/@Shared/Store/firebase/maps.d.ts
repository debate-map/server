import { Map } from "./maps/@Map";
export declare const GetMaps: ((orderByEdits?: boolean) => Map[]) & {
    Wait: (orderByEdits?: boolean) => Map[];
};
export declare const GetMaps_Private: ((orderByEdits?: boolean) => Map[]) & {
    Wait: (orderByEdits?: boolean) => Map[];
};
export declare const GetMaps_Public: ((orderByEdits?: boolean) => Map[]) & {
    Wait: (orderByEdits?: boolean) => Map[];
};
export declare const GetMap: ((id: string) => Map) & {
    Wait: (id: string) => Map;
};
