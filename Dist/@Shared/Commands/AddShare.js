var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AssertValidate, Command, GenerateUUID } from "mobx-firelink";
import { UserEdit } from "../CommandMacros";
/*
ID-generation schemes
==========
base64: about as compact you can get while maintaining url-friendliness [I usually use "-" and "_" as the two extra chars]
base54: like base64, but no vowels, avoiding exact-match profanity
base50: like base64, but no vowels or vowel-digits (4:A, 3:E, 1:I, 0:O), avoiding exact-match and obvious-match profanity

The below implements: base50, length of 10 (generated randomly, like uuids)

I feel this is a suitable balance between:
1) Compactness: 10-chars is about the same length as the 11-chars youtube video ids
2) Room to avoid clashes: 50^10 [ids possible] / 10^13 [316 years, in ms] = 9765 (ie. if generating sequentially, at ~10k ids per millisecond [~10 million per second], you could keep going for 316 years)
3) Avoiding of profanity: You avoid all exact-match profanity, as well as the standard digit->vowel equivalents
*/
/** Generates a base-50, 10-char id. Designed as a balance between compactness, clash-avoidance, and profanity-avoidance. */
export function GenerateSafeID() {
    let result = "";
    let charsToFill;
    while ((charsToFill = 10 - result.length) > 0) {
        let uuid_noVowelsOrVowelDigits = GenerateUUID().replace(/[AEIOUaeiou4310]/g, "");
        result += uuid_noVowelsOrVowelDigits.substr(0, charsToFill);
    }
    return result;
}
let AddShare = class AddShare extends Command {
    Validate() {
        var _a;
        const { share } = this.payload;
        this.shareID = (_a = this.shareID, (_a !== null && _a !== void 0 ? _a : GenerateSafeID()));
        share.creator = this.userInfo.id;
        share.createdAt = Date.now();
        this.returnData = this.shareID;
        AssertValidate("Share", share, "Share invalid");
    }
    GetDBUpdates() {
        const { share } = this.payload;
        const updates = {
            [`shares/${this.shareID}`]: share,
        };
        return updates;
    }
};
AddShare = __decorate([
    UserEdit
], AddShare);
export { AddShare };
