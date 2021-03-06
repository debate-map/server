import { Collection_Closed, Collection, FireUserInfo } from "mobx-firelink";
import { GeneralData } from "./firebase/general";
import { Media } from "./firebase/media/@Media";
import { Layer } from "./firebase/layers/@Layer";
import { NodeEditTimes } from "./firebase/mapNodeEditTimes";
import { Map } from "./firebase/maps/@Map";
import { MapNodePhrasing } from "./firebase/nodePhrasings/@MapNodePhrasing";
import { MapNode } from "./firebase/nodes/@MapNode";
import { MapNodeRevision } from "./firebase/nodes/@MapNodeRevision";
import { Term } from "./firebase/terms/@Term";
import { Timeline } from "./firebase/timelines/@Timeline";
import { TimelineStep } from "./firebase/timelineSteps/@TimelineStep";
import { UserMapInfoSet } from "./firebase/userMapInfo/@UserMapInfo";
import { User } from "./firebase/users/@User";
import { User_Private } from "./firebase/users_private/@User_Private";
import { MapNodeTag } from "./firebase/nodeTags/@MapNodeTag";
import { Rating } from "./firebase/nodeRatings/@Rating";
import { Share } from "./firebase/shares/@Share";
export interface FirebaseDBShape {
    general: Collection_Closed<{
        data: GeneralData;
    }>;
    modules: Collection_Closed<{}>;
    medias: Collection<Media>;
    layers: Collection<Layer>;
    maps: Collection<Map>;
    mapNodeEditTimes: Collection<NodeEditTimes>;
    nodes: Collection<MapNode>;
    nodeRatings: Collection<Rating>;
    nodeRevisions: Collection<MapNodeRevision>;
    nodePhrasings: Collection<MapNodePhrasing>;
    nodeTags: Collection<MapNodeTag>;
    shares: Collection<Share>;
    terms: Collection<Term>;
    timelines: Collection<Timeline>;
    timelineSteps: Collection<TimelineStep>;
    users: Collection<User>;
    users_private: Collection<User_Private>;
    userMapInfo: Collection<UserMapInfoSet>;
}
export declare const GetAuth: () => FireUserInfo;
export declare const GetAuth_Raw: (() => any) & {
    Wait: () => any;
};
