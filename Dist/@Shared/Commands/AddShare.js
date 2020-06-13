var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AssertValidate, Command, GenerateUUID } from "mobx-firelink";
import { UserEdit } from "../CommandMacros";
let AddShare = class AddShare extends Command {
    Validate() {
        var _a;
        const { share } = this.payload;
        this.shareID = (_a = this.shareID, (_a !== null && _a !== void 0 ? _a : GenerateUUID())); // todo: switch to base-50, 10-char approach described in task
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
