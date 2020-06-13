import { Command } from "mobx-firelink";
import { Share } from "../../Link";
declare type MainType = Share;
export declare class UpdateShare extends Command<{
    id: string;
    updates: Partial<MainType>;
}, {}> {
    oldData: MainType;
    newData: MainType;
    Validate(): void;
    GetDBUpdates(): any;
}
export {};
