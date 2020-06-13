import { Command } from "mobx-firelink";
import { Share } from "../../Link";
export declare class AddShare extends Command<{
    share: Share;
}, string> {
    shareID: string;
    Validate(): void;
    GetDBUpdates(): any;
}
