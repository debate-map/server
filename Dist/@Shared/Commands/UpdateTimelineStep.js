var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AddSchema, AssertValidate, GetSchemaJSON, Schema, AV } from "mobx-firelink";
import { Command } from "mobx-firelink";
import { UserEdit } from "../CommandMacros";
import { GetTimelineStep } from "../Store/firebase/timelineSteps";
import { CE } from "js-vextensions";
import { AssertExistsAndUserIsCreatorOrMod } from "./Helpers/SharedAsserts";
import { GetTimeline } from "../../Link";
AddSchema("UpdateTimelineStep_payload", ["TimelineStep"], () => ({
    properties: {
        stepID: { type: "string" },
        stepUpdates: Schema({
            properties: CE(GetSchemaJSON("TimelineStep").properties).Including("title", "message", "groupID", "videoTime", "nodeReveals"),
        }),
    },
    required: ["stepID", "stepUpdates"],
}));
let UpdateTimelineStep = class UpdateTimelineStep extends Command {
    Validate() {
        AssertValidate("UpdateTimelineStep_payload", this.payload, "Payload invalid");
        const { stepID, stepUpdates } = this.payload;
        this.oldData = GetTimelineStep(stepID);
        const timeline = AV.NonNull = GetTimeline(this.oldData.timelineID);
        AssertExistsAndUserIsCreatorOrMod(this, { creator: timeline.creator }, "update");
        this.newData = Object.assign(Object.assign({}, this.oldData), stepUpdates);
        AssertValidate("TimelineStep", this.newData, "New timeline-step-data invalid");
    }
    GetDBUpdates() {
        const { stepID } = this.payload;
        const updates = {};
        updates[`timelineSteps/${stepID}`] = this.newData;
        return updates;
    }
};
UpdateTimelineStep = __decorate([
    UserEdit
], UpdateTimelineStep);
export { UpdateTimelineStep };
