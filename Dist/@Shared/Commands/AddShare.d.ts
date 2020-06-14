import { Command } from "mobx-firelink";
import { Share } from "../../Link";
/** Generates a base-50, 10-char id. Designed as a balance between compactness, clash-avoidance, and profanity-avoidance. */
export declare function GenerateSafeID(): string;
export declare class AddShare extends Command<{
    share: Share;
}, string> {
    shareID: string;
    Validate(): void;
    GetDBUpdates(): any;
}
