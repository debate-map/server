import { Media } from "./media/@Media";
export declare const GetMedia: ((id: string) => Media) & {
    Wait: (id: string) => Media;
};
export declare const GetMedias: (() => Media[]) & {
    Wait: () => Media[];
};
export declare const GetMediasByURL: ((url: string) => Media[]) & {
    Wait: (url: string) => Media[];
};
