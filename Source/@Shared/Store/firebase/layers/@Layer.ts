import {AddSchema, UUID_regex} from "mobx-firelink";
import {ObservableMap} from "mobx";
import {CE} from "js-vextensions";

export class Layer {
	constructor(initialData: {name: string, creator: string} & Partial<Layer>) {
		CE(this).VSet(initialData);
	}

	_key: string;
	name: string;
	creator: string;
	createdAt: number;

	mapsWhereEnabled: ObservableMap<string, boolean>;
	nodeSubnodes: ObservableMap<string, LayerNodeSubnodes>; // key: node-id
}
AddSchema("Layer", {
	properties: {
		name: {type: "string"},
		creator: {type: "string"},
		createdAt: {type: "number"},

		mapsWhereEnabled: {patternProperties: {[UUID_regex]: {type: "boolean"}}},
		nodeSubnodes: {patternProperties: {[UUID_regex]: {$ref: "LayerNodeSubnodes"}}},
	},
	required: ["name", "creator", "createdAt"],
});

export type LayerNodeSubnodes = ObservableMap<string, boolean>; // key: subnode-id
AddSchema("LayerNodeSubnodes", {patternProperties: {[UUID_regex]: {type: "boolean"}}});