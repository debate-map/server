import {UserEdit} from "../CommandMacros";
import {Command_Old, Command} from "mobx-firelink";
import {AssertValidate, GenerateUUID} from "mobx-firelink";
import {Layer} from "../Store/firebase/layers/@Layer";

@UserEdit
export class AddLayer extends Command<{layer: Layer}, {}> {
	layerID: string;
	Validate() {
		const {layer} = this.payload;
		this.layerID = this.layerID ?? GenerateUUID();
		layer.createdAt = Date.now();
		AssertValidate("Layer", layer, "Layer invalid");
	}

	GetDBUpdates() {
		const {layer} = this.payload;
		const updates = {
			// 'general/data/.lastLayerID': this.layerID,
			[`layers/${this.layerID}`]: layer,
		} as any;
		return updates;
	}
}