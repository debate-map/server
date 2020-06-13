import {AssertValidate, Command, GenerateUUID} from "mobx-firelink";
import {Share} from "../../Link";
import {UserEdit} from "../CommandMacros";

@UserEdit
export class AddShare extends Command<{share: Share}, string> {
	shareID: string;
	Validate() {
		const {share} = this.payload;
		this.shareID = this.shareID ?? GenerateUUID(); // todo: switch to base-50, 10-char approach described in task
		share.creator = this.userInfo.id;
		share.createdAt = Date.now();

		this.returnData = this.shareID;
		AssertValidate("Share", share, "Share invalid");
	}

	GetDBUpdates() {
		const {share} = this.payload;
		const updates = {
			[`shares/${this.shareID}`]: share,
		} as any;
		return updates;
	}
}