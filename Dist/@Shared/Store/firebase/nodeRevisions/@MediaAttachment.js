import { AddSchema } from "mobx-firelink";
import { Source } from "./@SourceChain";
import { CE } from "js-vextensions";
export class MediaAttachment {
    constructor(initialData) {
        this.sourceChains = [
            { sources: [new Source()] },
        ];
        CE(this).VSet(initialData);
    }
}
AddSchema("MediaAttachment", {
    properties: {
        id: { type: "string" },
        captured: { type: "boolean" },
        previewWidth: { type: ["number", "null"] },
        sourceChains: { items: { $ref: "SourceChain" } },
    },
    required: ["id"],
});
