import {UserEdit} from "../CommandMacros";
import {Command_Old, GetAsync, Command, AssertV} from "mobx-firelink";
import {Media} from "../Store/firebase/media/@Media";
import {GetMedia, IsUserCreatorOrMod} from "../../Link";
import {AssertExistsAndUserIsCreatorOrMod} from "./Helpers/SharedAsserts";

@UserEdit
export class DeleteMedia extends Command<{id: string}, {}> {
	oldData: Media;
	Validate() {
		const {id} = this.payload;
		this.oldData = GetMedia(id);
		AssertExistsAndUserIsCreatorOrMod(this, this.oldData, "delete");
	}

	GetDBUpdates() {
		const {id} = this.payload;
		const updates = {
			[`medias/${id}`]: null,
		};
		return updates;
	}
}