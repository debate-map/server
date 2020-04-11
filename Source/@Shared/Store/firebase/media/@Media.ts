import {GetValues_ForSchema, CE} from "js-vextensions";
import {AddSchema} from "mobx-firelink";
import {Source, SourceChain} from "../nodeRevisions/@SourceChain";

export enum MediaType {
	Image = 10,
	Video = 20,
}
AddSchema("MediaType", {oneOf: GetValues_ForSchema(MediaType)});

export function GetNiceNameForMediaType(type: MediaType) {
	return MediaType[type].toLowerCase();
}

export class Media {
	constructor(initialData: {name: string, type: MediaType} & Partial<Media>) {
		CE(this).VSet(initialData);
		// this.createdAt = Date.now();
	}

	_key: string;

	name: string;
	type: MediaType;
	captured: boolean; // if true, means the image/video is claimed as a capturing of real-world footage
	url = "";
	description: string;

	creator: string;
	createdAt: number;
}
export const Media_namePattern = '^[a-zA-Z0-9 ,\'"%\\-()\\/]+$';
//export const Media_urlPattern = "^https?://[^\\s/$.?#]+\\.[^\\s]+\\.(jpg|jpeg|gif|png)$";
AddSchema("Media", {
	properties: {
		name: {type: "string", pattern: Media_namePattern},
		type: {$ref: "MediaType"},
		captured: {type: "boolean"},
		// url: { pattern: Media_urlPattern },
		url: {type: "string"}, // allow overriding url pattern; it just highlights possible mistakes
		description: {type: "string"},

		creator: {type: "string"},
		createdAt: {type: "number"},
	},
	required: ["name", "type", "url", "description", "sourceChains", "creator", "createdAt"],
});

// todo: update UI code
// todo: update existing db entries (MapNodeRevision: image->media, ImageAttachment: add previewWidth and sourceChains, Image: remove previewWidth and sourceChains)