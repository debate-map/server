import { AddSchema } from "mobx-firelink";
import { CE } from "js-vextensions";
export class Timeline {
    constructor(initialData) {
        CE(this).VSet(initialData);
    }
}
AddSchema("Timeline", {
    properties: {
        creator: { type: "string" },
        createdAt: { type: "number" },
        mapID: { type: "string" },
        name: { type: "string" },
        videoID: { type: ["string", "null"] },
        videoStartTime: { type: ["number", "null"] },
        videoHeightVSWidthPercent: { type: "number" },
        steps: { items: { type: "string" } },
    },
    required: ["mapID", "name", "creator", "createdAt"],
});
