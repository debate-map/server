import { Command } from "mobx-firelink";
import { Media } from "../Store/firebase/media/@Media";
export declare class AddMedia extends Command<{
    media: Media;
}, string> {
    mediaID: string;
    Validate(): void;
    GetDBUpdates(): {
        [x: string]: Media;
    };
}
