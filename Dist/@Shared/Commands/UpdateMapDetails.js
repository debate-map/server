var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MapEdit } from "../CommandMacros";
import { AddSchema, AssertValidate, Schema, GetSchemaJSON } from "mobx-firelink";
import { Command } from "mobx-firelink";
import { UserEdit } from "../CommandMacros";
import { GetMap } from "../Store/firebase/maps";
import { CE } from "js-vextensions";
import { AssertExistsAndUserIsCreatorOrMod } from "./Helpers/SharedAsserts";
const MTName = "Map";
AddSchema(`Update${MTName}Details_payload`, [MTName], () => ({
    properties: {
        id: { type: "string" },
        updates: Schema({
            properties: CE(GetSchemaJSON(MTName).properties).Including("name", "note", "noteInline", "visibility", "defaultExpandDepth", "defaultTimelineID", "requireMapEditorsCanEdit", "nodeDefaults", "editorIDs"),
        }),
    },
    required: ["id", "updates"],
}));
let UpdateMapDetails = class UpdateMapDetails extends Command {
    Validate() {
        AssertValidate(`Update${MTName}Details_payload`, this.payload, "Payload invalid");
        const { id: mapID, updates: mapUpdates } = this.payload;
        this.oldData = GetMap(mapID);
        AssertExistsAndUserIsCreatorOrMod(this, this.oldData, "update");
        this.newData = Object.assign(Object.assign({}, this.oldData), mapUpdates);
        this.newData.editedAt = Date.now();
        AssertValidate(MTName, this.newData, `New ${MTName.toLowerCase()}-data invalid`);
    }
    GetDBUpdates() {
        const { id } = this.payload;
        const updates = {};
        updates[`maps/${id}`] = this.newData;
        return updates;
    }
};
UpdateMapDetails = __decorate([
    MapEdit("id"),
    UserEdit
], UpdateMapDetails);
export { UpdateMapDetails };
