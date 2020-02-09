import {AddSchema} from "mobx-firelink";
import {Source, SourceChain} from "./@SourceChain";

export class ReferencesAttachment {
	constructor() {
		this.sourceChains = [
			{sources: [new Source()]},
		];
	}
	sourceChains: SourceChain[];
}
AddSchema("ReferencesAttachment", {
	properties: {
		sourceChains: {items: {$ref: "SourceChain"}},
	},
	required: ["sourceChains"],
});