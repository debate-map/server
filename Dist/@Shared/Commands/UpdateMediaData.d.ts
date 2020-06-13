import { Command } from "mobx-firelink";
import { Media } from "../Store/firebase/media/@Media";
declare type MainType = Media;
export declare class UpdateMediaData extends Command<{
    id: string;
    updates: Partial<Media>;
}, {}> {
    oldData: MainType;
    newData: MainType;
    Validate(): void;
    GetDBUpdates(): any;
}
export {};
