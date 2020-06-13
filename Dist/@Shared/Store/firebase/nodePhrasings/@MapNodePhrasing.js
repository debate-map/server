import { AddSchema } from "mobx-firelink";
import { GetValues_ForSchema, CE } from "js-vextensions";
export class MapNodePhrasing {
    constructor(initialData) {
        CE(this).VSet(initialData);
    }
}
AddSchema("MapNodePhrasing", {
    properties: {
        creator: { type: "string" },
        createdAt: { type: "number" },
        node: { type: "string" },
        type: { $ref: "MapNodePhrasingType" },
        text: { type: "string" },
        description: { type: "string" },
    },
    required: ["creator", "createdAt", "node", "type", "text"],
});
export var MapNodePhrasingType;
(function (MapNodePhrasingType) {
    MapNodePhrasingType[MapNodePhrasingType["Precise"] = 10] = "Precise";
    MapNodePhrasingType[MapNodePhrasingType["Natural"] = 20] = "Natural";
})(MapNodePhrasingType || (MapNodePhrasingType = {}));
AddSchema("MapNodePhrasingType", { oneOf: GetValues_ForSchema(MapNodePhrasingType) });
