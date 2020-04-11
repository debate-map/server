import {UserEdit} from "../CommandMacros";
import {Command_Old, GetAsync, Command} from "mobx-firelink";
import {Media} from "../Store/firebase/media/@Media";
import {GetMedia} from "../../Link";

@UserEdit
export class DeleteMedia extends Command<{id: string}, {}> {
	oldData: Media;
	Validate() {
		const {id} = this.payload;
		this.oldData = GetMedia(id);
	}

	GetDBUpdates() {
		const {id} = this.payload;
		const updates = {
			[`medias/${id}`]: null,
		};
		return updates;
	}
}