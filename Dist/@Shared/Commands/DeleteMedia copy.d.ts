import { Command } from "mobx-firelink";
import { Media } from "../Store/firebase/media/@Media";
export declare class DeleteMedia extends Command<{
    id: string;
}, {}> {
    oldData: Media;
    Validate(): void;
    GetDBUpdates(): {
        [x: string]: any;
    };
}
