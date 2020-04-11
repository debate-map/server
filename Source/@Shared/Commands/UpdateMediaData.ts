import {CE} from "js-vextensions";
import {AddSchema, AssertV, AssertValidate, Command, GetSchemaJSON, Schema} from "mobx-firelink";
import {UserEdit} from "../CommandMacros";
import {Media} from "../Store/firebase/media/@Media";
import {GetMedia} from "../../Link";

type MainType = Media;
const MTName = "Media";

AddSchema(`Update${MTName}Details_payload`, [MTName], ()=>({
	properties: {
		id: {type: "string"},
		updates: Schema({
			properties: CE(GetSchemaJSON(MTName).properties).Including("name", "type", "captured", "url", "description"),
		}),
	},
	required: ["id", "updates"],
}));

@UserEdit
export class UpdateMediaData extends Command<{id: string, updates: Partial<Media>}, {}> {
	oldData: Media;
	newData: Media;
	Validate() {
		AssertValidate(`Update${MTName}Details_payload`, this.payload, "Payload invalid");

		const {id, updates} = this.payload;
		this.oldData = GetMedia(id);
		AssertV(this.oldData, "oldData is null.");
		this.newData = {...this.oldData, ...updates};
		AssertValidate("Media", this.newData, "New-data invalid");
	}

	GetDBUpdates() {
		const {id} = this.payload;

		const updates = {
			[`medias/${id}`]: this.newData,
		} as any;
		return updates;
	}
}