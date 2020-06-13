import { Vector2 } from "js-vextensions";
export declare class MapView {
    rootNodeViews: {
        [key: string]: MapNodeView;
    };
    bot_currentNodeID?: string;
}
export declare class MapNodeView {
    expanded?: boolean;
    expanded_truth?: boolean;
    expanded_relevance?: boolean;
    /** True for node which is selected (ie. has its hover-panel locked open). */
    selected?: boolean;
    /** True for node whose box is closest to the view center. */
    focused?: boolean;
    /** Offset of view-center from self (since we're the focus-node). */
    viewOffset?: Vector2;
    openPanel?: string;
    openTermID?: string;
    children: {
        [key: string]: MapNodeView;
    };
    childLimit_up?: number;
    childLimit_down?: number;
}
export declare const emptyNodeView: MapNodeView;
