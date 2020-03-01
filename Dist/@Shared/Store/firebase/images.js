import { IsNaN } from "js-vextensions";
import { GetDoc, GetDocs, StoreAccessor, WhereOp } from "mobx-firelink";
export const GetImage = StoreAccessor(s => (id) => {
    if (id == null || IsNaN(id))
        return null;
    return GetDoc({}, a => a.images.get(id));
});
/* export async function GetImageAsync(id: string) {
    return await GetDataAsync(`images/${id}`) as Image;
} */
export const GetImages = StoreAccessor(s => () => {
    return GetDocs({}, a => a.images);
});
export const GetImagesByURL = StoreAccessor(s => (url) => {
    return GetDocs({
        queryOps: [new WhereOp("url", "==", url)],
    }, a => a.images);
});
