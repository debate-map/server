import { Assert, CE } from "js-vextensions";
import { Polarity } from "./@MapNode";
export var MapNodeType;
(function (MapNodeType) {
    MapNodeType[MapNodeType["Category"] = 10] = "Category";
    MapNodeType[MapNodeType["Package"] = 20] = "Package";
    MapNodeType[MapNodeType["MultiChoiceQuestion"] = 30] = "MultiChoiceQuestion";
    MapNodeType[MapNodeType["Claim"] = 40] = "Claim";
    MapNodeType[MapNodeType["Argument"] = 50] = "Argument";
})(MapNodeType || (MapNodeType = {}));
export class MapNodeType_Info {
    constructor(initialData) {
        CE(this).VSet(initialData);
    }
}
MapNodeType_Info.for = {
    [MapNodeType.Category]: new MapNodeType_Info({
        childTypes: [MapNodeType.Category, MapNodeType.Package, MapNodeType.MultiChoiceQuestion, MapNodeType.Claim],
        minWidth: 100, maxWidth: 250,
    }),
    [MapNodeType.Package]: new MapNodeType_Info({
        childTypes: [MapNodeType.Claim],
        minWidth: 100, maxWidth: 250,
    }),
    [MapNodeType.MultiChoiceQuestion]: new MapNodeType_Info({
        childTypes: [MapNodeType.Claim],
        minWidth: 100, maxWidth: 250,
    }),
    [MapNodeType.Claim]: new MapNodeType_Info({
        childTypes: [MapNodeType.Argument],
        minWidth: 350, maxWidth: 550,
    }),
    [MapNodeType.Argument]: new MapNodeType_Info({
        childTypes: [MapNodeType.Claim, MapNodeType.Argument],
        minWidth: 100, maxWidth: 300,
    }),
};
export function GetMapNodeTypeDisplayName(type, parentNode, parentNodeForm, polarity) {
    if (type == MapNodeType.Category)
        return "category";
    if (type == MapNodeType.Package)
        return "package";
    if (type == MapNodeType.MultiChoiceQuestion)
        return "multi-choice question";
    if (type == MapNodeType.Claim) {
        if (parentNode && parentNode.type == MapNodeType.Category) {
            return "claim (in question form)";
        }
        return "claim";
    }
    if (type == MapNodeType.Argument) {
        return polarity == Polarity.Supporting ? "supporting argument" : "opposing argument";
    }
    Assert(false, "Invalid node type.");
}
