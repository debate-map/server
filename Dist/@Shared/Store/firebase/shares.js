import { GetDoc, StoreAccessor, GetDocs, WhereOp } from "mobx-firelink";
export const GetShare = StoreAccessor(s => (id) => {
    if (id == null)
        return null;
    return GetDoc({}, a => a.shares.get(id));
});
export const GetShares = StoreAccessor(s => (userID, mapID) => {
    return GetDocs({
        queryOps: [
            new WhereOp("creator", "==", userID),
            mapID && new WhereOp("mapID", "==", mapID),
        ].filter(a => a),
    }, a => a.shares);
});
