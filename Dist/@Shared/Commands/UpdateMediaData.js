var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CE } from "js-vextensions";
import { AddSchema, AssertValidate, Command, GetSchemaJSON, Schema } from "mobx-firelink";
import { UserEdit } from "../CommandMacros";
import { GetMedia } from "../../Link";
import { AssertExistsAndUserIsCreatorOrMod } from "./Helpers/SharedAsserts";
const MTName = "Media";
AddSchema(`Update${MTName}Data_payload`, [MTName], () => ({
    properties: {
        id: { type: "string" },
        updates: Schema({
            properties: CE(GetSchemaJSON(MTName).properties).Including("name", "type", "url", "description"),
        }),
    },
    required: ["id", "updates"],
}));
let UpdateMediaData = class UpdateMediaData extends Command {
    Validate() {
        AssertValidate(`Update${MTName}Data_payload`, this.payload, "Payload invalid");
        const { id, updates } = this.payload;
        this.oldData = GetMedia(id);
        AssertExistsAndUserIsCreatorOrMod(this, this.oldData, "update");
        this.newData = Object.assign(Object.assign({}, this.oldData), updates);
        AssertValidate(MTName, this.newData, "New-data invalid");
    }
    GetDBUpdates() {
        const { id } = this.payload;
        const updates = {
            [`medias/${id}`]: this.newData,
        };
        return updates;
    }
};
UpdateMediaData = __decorate([
    UserEdit
], UpdateMediaData);
export { UpdateMediaData };
