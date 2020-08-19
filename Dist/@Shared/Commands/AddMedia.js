var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { UserEdit } from "../CommandMacros";
import { Command, AssertV } from "mobx-firelink";
import { AssertValidate, GenerateUUID } from "mobx-firelink";
import { HasModPermissions } from "../Store/firebase/users/$user";
let AddMedia = class AddMedia extends Command {
    Validate() {
        var _a;
        AssertV(HasModPermissions(this.userInfo.id), "Only moderators can add media currently. (till review/approval system is implemented)");
        const { media } = this.payload;
        this.mediaID = (_a = this.mediaID) !== null && _a !== void 0 ? _a : GenerateUUID();
        media.creator = this.userInfo.id;
        media.createdAt = Date.now();
        this.returnData = this.mediaID;
        AssertValidate("Media", media, "Media invalid");
    }
    GetDBUpdates() {
        const { media } = this.payload;
        const updates = {
            [`medias/${this.mediaID}`]: media,
        };
        return updates;
    }
};
AddMedia = __decorate([
    UserEdit
], AddMedia);
export { AddMedia };
