import { Command } from "mobx-firelink";
import { Share } from "../../Link";
export declare class DeleteShare extends Command<{
    id: string;
}, {}> {
    oldData: Share;
    Validate(): void;
    GetDBUpdates(): {
        [x: string]: any;
    };
}
