var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { UserEdit } from "../CommandMacros";
import { Command } from "mobx-firelink";
import { GetMedia } from "../../Link";
import { AssertExistsAndUserIsCreatorOrMod } from "./Helpers/SharedAsserts";
let DeleteMedia = class DeleteMedia extends Command {
    Validate() {
        const { id } = this.payload;
        this.oldData = GetMedia(id);
        AssertExistsAndUserIsCreatorOrMod(this, this.oldData, "delete");
    }
    GetDBUpdates() {
        const { id } = this.payload;
        const updates = {
            [`medias/${id}`]: null,
        };
        return updates;
    }
};
DeleteMedia = __decorate([
    UserEdit
], DeleteMedia);
export { DeleteMedia };
