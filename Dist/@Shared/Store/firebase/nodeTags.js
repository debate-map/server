import { WhereOp, GetDoc, GetDocs, StoreAccessor } from "mobx-firelink";
import { emptyArray_forLoading, CE } from "js-vextensions";
import { GetTagCompClassByTag, GetTagCompOfTag } from "./nodeTags/@MapNodeTag";
// todo: add and use some sort of system where mobx-firelink auto-reattaches data to their classes, based on AJV metadata
export const GetNodeTags = StoreAccessor(s => (nodeID) => {
    return GetDocs({
        //queryOps: [new WhereOp(`nodes.${nodeID}`, ">", "")], // `if value > ""` means "if key exists"
        queryOps: [new WhereOp(`nodes`, "array-contains", nodeID)],
    }, a => a.nodeTags);
});
export const GetNodeTag = StoreAccessor(s => (tagID) => {
    return GetDoc({}, a => a.nodeTags.get(tagID));
});
export const GetNodeTagComps = StoreAccessor(s => (nodeID, unwrapCompositeTags = true, tagsToIgnore) => {
    const tags = GetNodeTags(nodeID);
    if (tags == emptyArray_forLoading)
        return emptyArray_forLoading;
    return CE(tags).SelectMany(tag => {
        if (tagsToIgnore === null || tagsToIgnore === void 0 ? void 0 : tagsToIgnore.includes(tag._key))
            return [];
        const baseComp = GetTagCompOfTag(tag);
        return unwrapCompositeTags ? GetFinalTagCompsForTag(tag) : [baseComp];
    });
});
export const GetFinalTagCompsForTag = StoreAccessor(s => (tag) => {
    const compClass = GetTagCompClassByTag(tag);
    const comp = GetTagCompOfTag(tag);
    //return comp.As(compClass).GetFinalTagComps();
    return compClass.prototype.GetFinalTagComps.call(comp);
});
