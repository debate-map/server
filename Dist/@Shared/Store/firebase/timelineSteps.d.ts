import { Timeline } from "./timelines/@Timeline";
import { TimelineStep } from "./timelineSteps/@TimelineStep";
export declare const GetTimelineStep: ((id: string) => TimelineStep) & {
    Wait: (id: string) => TimelineStep;
};
export declare const GetTimelineSteps: ((timeline: Timeline, emptyForLoading?: boolean) => TimelineStep[]) & {
    Wait: (timeline: Timeline, emptyForLoading?: boolean) => TimelineStep[];
};
export declare const GetNodeRevealTimesInSteps: ((steps: TimelineStep[], baseOnLastReveal?: boolean) => never[] | {
    [key: string]: number;
}) & {
    Wait: (steps: TimelineStep[], baseOnLastReveal?: boolean) => never[] | {
        [key: string]: number;
    };
};
export declare const GetNodesRevealedInSteps: ((steps: TimelineStep[]) => string[]) & {
    Wait: (steps: TimelineStep[]) => string[];
};
