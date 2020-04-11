import {UserEdit} from "../CommandMacros";
import {Command_Old, Command, AssertV} from "mobx-firelink";
import {AssertValidate, GenerateUUID} from "mobx-firelink";
import {HasModPermissions} from "../Store/firebase/users/$user";
import {Media} from "../Store/firebase/media/@Media";

@UserEdit
export class AddMedia extends Command<{media: Media}, string> {
	mediaID: string;
	Validate() {
		AssertV(HasModPermissions(this.userInfo.id), "Only moderators can add media currently. (till review/approval system is implemented)");

		const {media} = this.payload;
		this.mediaID = this.mediaID ?? GenerateUUID();
		media.creator = this.userInfo.id;
		media.createdAt = Date.now();

		this.returnData = this.mediaID;
		AssertValidate("Media", media, "Media invalid");
	}

	GetDBUpdates() {
		const {media} = this.payload;
		const updates = {
			[`medias/${this.mediaID}`]: media,
		};
		return updates;
	}
}