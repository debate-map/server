import { Command } from "mobx-firelink";
export declare function AssertExistsAndUserIsCreatorOrMod(command: Command<any, any>, entity: {
    creator?: string;
}, act?: string): void;
