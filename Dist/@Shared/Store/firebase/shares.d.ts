import { Share } from "./shares/@Share";
export declare const GetShare: ((id: string) => Share) & {
    Wait: (id: string) => Share;
};
export declare const GetShares: ((userID: string, mapID?: string) => Share[]) & {
    Wait: (userID: string, mapID?: string) => Share[];
};
