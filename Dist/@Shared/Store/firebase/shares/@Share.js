import { AddSchema } from "mobx-firelink";
import { CE, GetValues_ForSchema } from "js-vextensions";
export var ShareType;
(function (ShareType) {
    ShareType[ShareType["Map"] = 10] = "Map";
})(ShareType || (ShareType = {}));
AddSchema("ShareType", { oneOf: GetValues_ForSchema(ShareType) });
export class Share {
    constructor(initialData) {
        CE(this).VSet(initialData);
    }
}
AddSchema("Share", {
    properties: {
        creator: { type: "string" },
        createdAt: { type: "number" },
        name: { type: "string" },
        type: { $ref: "ShareType" },
        mapID: { type: "string" },
        mapView: { $ref: "MapView" },
    },
    required: ["creator", "createdAt", "type"],
});
