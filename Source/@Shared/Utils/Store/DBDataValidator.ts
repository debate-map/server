import {AssertValidate} from "mobx-firelink";
import {FirebaseDBShape} from "../../Store/firebase";

export function ValidateDBData(data: FirebaseDBShape) {
	function ValidateCollection(collection, itemType: string) {
		(collection || {}).VValues().forEach(entry=>{
			AssertValidate(itemType, entry, `${itemType} invalid`);
		});
	}

	ValidateCollection(data.images, "Image");
	ValidateCollection(data.layers, "Layer");
	ValidateCollection(data.maps, "Map");
	ValidateCollection(data.nodes, "MapNode");
	ValidateCollection(data.nodePhrasings, "MapNodePhrasing");
	ValidateCollection(data.nodeRevisions, "MapNodeRevision");
	ValidateCollection(data.terms, "Term");
	ValidateCollection(data.timelines, "Timeline");
	ValidateCollection(data.timelineSteps, "TimelineStep");
}