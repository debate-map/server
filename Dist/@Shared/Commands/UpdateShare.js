var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CE } from "js-vextensions";
import { AssertValidate, Command, GetSchemaJSON, Schema } from "mobx-firelink";
import { UserEdit } from "../CommandMacros";
import { GetShare } from "../../Link";
import { AssertExistsAndUserIsCreatorOrMod } from "./Helpers/SharedAsserts";
const MTName = "Share";
let UpdateShare = class UpdateShare extends Command {
    Validate() {
        AssertValidate({
            properties: {
                id: { type: "string" },
                updates: Schema({
                    properties: CE(GetSchemaJSON(MTName).properties).Including("name", "mapID", "mapView"),
                }),
            },
            required: ["id", "updates"],
        }, this.payload, "Payload invalid");
        const { id, updates } = this.payload;
        this.oldData = GetShare(id);
        AssertExistsAndUserIsCreatorOrMod(this, this.oldData, "update");
        this.newData = Object.assign(Object.assign({}, this.oldData), updates);
        AssertValidate(MTName, this.newData, "New-data invalid");
    }
    GetDBUpdates() {
        const { id } = this.payload;
        const updates = {
            [`shares/${id}`]: this.newData,
        };
        return updates;
    }
};
UpdateShare = __decorate([
    UserEdit
], UpdateShare);
export { UpdateShare };
