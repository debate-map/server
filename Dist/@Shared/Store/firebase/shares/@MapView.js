var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable } from "mobx-firelink/node_modules/mobx";
import { AddSchema } from "mobx-firelink";
const O = observable;
export class MapView {
    constructor() {
        // rootNodeView = new MapNodeView();
        // include root-node-view as a keyed-child, so that it's consistent with descendants (of key signifying id)
        // rootNodeView;
        // @O rootNodeViews = observable.map<string, MapNodeView>();
        // use simple object rather than observable-map, since observable-map would lose its prototype on page refresh (when mobx-sync starts loading stored data, this path is not initialized-with-types, since it's nested/non-static)
        // maybe todo: update mobx-sync to at least be able to handle the mobx classes (observable.map, observable.array, etc.)
        this.rootNodeViews = {};
    }
}
__decorate([
    O
], MapView.prototype, "rootNodeViews", void 0);
__decorate([
    O
], MapView.prototype, "bot_currentNodeID", void 0);
AddSchema("MapView", {
    properties: {
        rootNodeViews: { patternProperties: { ".{22}": { $ref: "MapNodeView" } } },
    },
    required: ["rootNodeViews"],
});
export class MapNodeView {
    constructor() {
        // constructor(childLimit?: number) {
        // constructor(childLimit: number) {
        /*constructor() {
            //this.childLimit = State(a=>a.main.initialChildLimit);
            // try to catch cause of odd "MapNodeView.children is undefined" issue hit sometimes
            Assert(this.children != null);
            new Timer(100, ()=>Assert(this.children != null), 1).Start();
        }*/
        /* expanded_truth?: boolean;
        expanded_relevance?: boolean; */
        this.expanded_truth = true;
        this.expanded_relevance = true;
        // @O children? = observable.map<string, MapNodeView>();
        this.children = {};
    }
}
__decorate([
    O
], MapNodeView.prototype, "expanded", void 0);
__decorate([
    O
], MapNodeView.prototype, "expanded_truth", void 0);
__decorate([
    O
], MapNodeView.prototype, "expanded_relevance", void 0);
__decorate([
    O
], MapNodeView.prototype, "selected", void 0);
__decorate([
    O
], MapNodeView.prototype, "focused", void 0);
__decorate([
    O
], MapNodeView.prototype, "viewOffset", void 0);
__decorate([
    O
], MapNodeView.prototype, "openPanel", void 0);
__decorate([
    O
], MapNodeView.prototype, "openTermID", void 0);
__decorate([
    O
], MapNodeView.prototype, "children", void 0);
__decorate([
    O
], MapNodeView.prototype, "childLimit_up", void 0);
__decorate([
    O
], MapNodeView.prototype, "childLimit_down", void 0);
export const emptyNodeView = new MapNodeView();
AddSchema("MapNodeView", {
    properties: {
        expanded: { type: "boolean" },
        expanded_truth: { type: "boolean" },
        expanded_relevance: { type: "boolean" },
        selected: { type: "boolean" },
        focused: { type: "boolean" },
        viewOffset: { $ref: "Vector2" },
        openPanel: { type: "string" },
        openTermID: { type: "string" },
        children: { patternProperties: { ".{22}": { $ref: "MapNodeView" } } },
        childLimit_up: { type: "number" },
        childLimit_down: { type: "number" },
    },
});
// export type MapNodeView_SelfOnly = Omit<MapNodeView, 'children'>;
// export const MapNodeView_SelfOnly_props = ['expanded', 'expanded_truth', 'expanded_relevance', 'selected', 'focused', 'viewOffset', 'openPanel', 'openTermID', 'childLimit_up', 'childLimit_down'];
/*export function NormalizedMapView(mapView: MapView) {
    const result = Clone(mapView);
    return result;
}*/ 
