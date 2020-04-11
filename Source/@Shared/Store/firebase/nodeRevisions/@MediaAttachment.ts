import {AddSchema} from "mobx-firelink";
import {SourceChain, Source} from "./@SourceChain";
import {CE} from "js-vextensions";

export class MediaAttachment {
	constructor(initialData?: Partial<MediaAttachment>) {
		this.sourceChains = [
			{sources: [new Source()]},
		];
		CE(this).VSet(initialData);
	}

	id: string;
	previewWidth: number; // used to limit the display-width, eg. to keep a tall-but-skinny image from extending multiple screens down
	sourceChains: SourceChain[];
}
AddSchema("MediaAttachment", {
	properties: {
		id: {type: "string"},
		previewWidth: {type: ["number", "null"]},
		sourceChains: {items: {$ref: "SourceChain"}},
	},
	required: ["id"],
});