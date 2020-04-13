import { GetValues_ForSchema, CE } from "js-vextensions";
import { AddSchema } from "mobx-firelink";
export var MediaType;
(function (MediaType) {
    MediaType[MediaType["Image"] = 10] = "Image";
    MediaType[MediaType["Video"] = 20] = "Video";
})(MediaType || (MediaType = {}));
AddSchema("MediaType", { oneOf: GetValues_ForSchema(MediaType) });
export function GetNiceNameForMediaType(type) {
    return MediaType[type].toLowerCase();
}
export class Media {
    constructor(initialData) {
        this.url = "";
        CE(this).VSet(initialData);
        // this.createdAt = Date.now();
    }
}
export const Media_namePattern = '^[a-zA-Z0-9 ,\'"%\\-()\\/]+$';
//export const Media_urlPattern = "^https?://[^\\s/$.?#]+\\.[^\\s]+\\.(jpg|jpeg|gif|png)$";
AddSchema("Media", {
    properties: {
        name: { type: "string", pattern: Media_namePattern },
        type: { $ref: "MediaType" },
        // url: { pattern: Media_urlPattern },
        url: { type: "string" },
        description: { type: "string" },
        creator: { type: "string" },
        createdAt: { type: "number" },
    },
    required: ["name", "type", "url", "description", "creator", "createdAt"],
});
