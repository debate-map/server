import { IsNaN } from "js-vextensions";
import { GetDoc, GetDocs, StoreAccessor, WhereOp } from "mobx-firelink";
export const GetMedia = StoreAccessor(s => (id) => {
    if (id == null || IsNaN(id))
        return null;
    return GetDoc({}, a => a.medias.get(id));
});
/* export async function GetImageAsync(id: string) {
    return await GetDataAsync(`images/${id}`) as Image;
} */
export const GetMedias = StoreAccessor(s => () => {
    return GetDocs({}, a => a.medias);
});
export const GetMediasByURL = StoreAccessor(s => (url) => {
    return GetDocs({
        queryOps: [new WhereOp("url", "==", url)],
    }, a => a.medias);
});
