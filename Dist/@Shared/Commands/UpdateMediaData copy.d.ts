import { Command } from "mobx-firelink";
import { Media } from "../Store/firebase/media/@Media";
export declare class UpdateMediaData extends Command<{
    id: string;
    updates: Partial<Media>;
}, {}> {
    oldData: Media;
    newData: Media;
    Validate(): void;
    GetDBUpdates(): any;
}
