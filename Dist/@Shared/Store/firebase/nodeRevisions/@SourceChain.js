import { GetValues_ForSchema, Assert } from "js-vextensions";
import { AddSchema } from "mobx-firelink";
// export type SourceChain = { [key: number]: Source; };
// export type SourceChainI = {[key: number]: Source;};
// export class SourceChain /*implements SourceChainI*/ {
/* export class SourceChain extends Array {
    [key: number]: Source;
    0 = new Source();
}; */
export class SourceChain {
    constructor(sources = []) {
        this.sources = sources;
    }
}
// AddSchema({patternProperties: {"^[A-Za-z0-9_-]+$": {$ref: "Source"}}, minProperties: 1}, "SourceChain");
AddSchema("SourceChain", {
    properties: {
        sources: { items: { $ref: "Source" }, minItems: 1 },
    },
    required: ["sources"],
});
export var SourceType;
(function (SourceType) {
    SourceType[SourceType["Speech"] = 10] = "Speech";
    SourceType[SourceType["Text"] = 20] = "Text";
    SourceType[SourceType["Image"] = 30] = "Image";
    SourceType[SourceType["Video"] = 40] = "Video";
    SourceType[SourceType["Webpage"] = 50] = "Webpage";
})(SourceType || (SourceType = {}));
AddSchema("SourceType", { oneOf: GetValues_ForSchema(SourceType) });
export const Source_linkURLPattern = "^https?://[^\\s/$.?#]+\\.[^\\s]+$";
export class Source {
    constructor() {
        this.type = SourceType.Webpage;
    }
}
AddSchema("Source", {
    properties: {
        type: { $ref: "SourceType" },
        name: { pattern: "\\S.*" },
        author: { pattern: "\\S.*" },
        location: { type: "string" },
        time_min: { type: "number" },
        time_max: { type: "number" },
        // link: { format: 'uri' },
        // link: { pattern: Source_linkURLPattern },
        link: { type: "string" },
    },
});
export function GetSourceNamePlaceholderText(sourceType) {
    if (sourceType == SourceType.Speech)
        return "speech name";
    if (sourceType == SourceType.Text)
        return "book/document name";
    if (sourceType == SourceType.Image)
        return "image name";
    if (sourceType == SourceType.Video)
        return "video name";
    // if (sourceType == SourceType.Webpage) return "(webpage name)";
    Assert(false);
}
export function GetSourceAuthorPlaceholderText(sourceType) {
    if (sourceType == SourceType.Speech)
        return "speaker";
    if (sourceType == SourceType.Text)
        return "book/document author";
    if (sourceType == SourceType.Image)
        return `image author`;
    if (sourceType == SourceType.Video)
        return "video author";
    if (sourceType == SourceType.Webpage)
        return "webpage author";
    Assert(false);
}
