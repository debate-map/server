import { ToNumber, emptyArray_forLoading, CE } from "js-vextensions";
import { GetDoc, StoreAccessor } from "mobx-firelink";
import { GetNode, GetNodeChildren } from "./nodes";
export const GetTimelineStep = StoreAccessor(s => (id) => {
    if (id == null)
        return null;
    return GetDoc({}, a => a.timelineSteps.get(id));
});
export const GetTimelineSteps = StoreAccessor(s => (timeline, emptyForLoading = true) => {
    const steps = (timeline.steps || []).map(id => GetTimelineStep(id));
    if (!emptyForLoading && CE(steps).Any(a => a == null))
        return emptyArray_forLoading;
    return steps;
});
export const GetNodeRevealTimesInSteps = StoreAccessor(s => (steps, baseOnLastReveal = false) => {
    const nodeRevealTimes = {};
    for (const [index, step] of steps.entries()) {
        for (const reveal of step.nodeReveals || []) {
            if (reveal.show) {
                const stepTime_safe = step.videoTime != null ? step.videoTime : CE(steps.slice(0, index).map(a => a.videoTime)).LastOrX(a => a != null);
                if (baseOnLastReveal) {
                    nodeRevealTimes[reveal.path] = Math.max(stepTime_safe, ToNumber(nodeRevealTimes[reveal.path], 0));
                }
                else {
                    nodeRevealTimes[reveal.path] = Math.min(stepTime_safe, ToNumber(nodeRevealTimes[reveal.path], Number.MAX_SAFE_INTEGER));
                }
                const revealDepth = ToNumber(reveal.show_revealDepth, 0);
                if (revealDepth >= 1) {
                    const node = GetNode(CE(reveal.path.split("/")).Last());
                    if (node == null)
                        continue;
                    // todo: fix that a child being null, apparently breaks the GetAsync() call in ActionProcessor.ts (for scrolling to just-revealed nodes)
                    let currentChildren = GetNodeChildren(node._key).map(child => ({ node: child, path: child && `${reveal.path}/${child._key}` }));
                    if (CE(currentChildren).Any(a => a.node == null)) {
                        // if (steps.length == 1 && steps[0]._key == 'clDjK76mSsGXicwd7emriw') debugger;
                        return emptyArray_forLoading;
                    }
                    for (let childrenDepth = 1; childrenDepth <= revealDepth; childrenDepth++) {
                        const nextChildren = [];
                        for (const child of currentChildren) {
                            if (baseOnLastReveal) {
                                nodeRevealTimes[child.path] = Math.max(stepTime_safe, ToNumber(nodeRevealTimes[child.path], 0));
                            }
                            else {
                                nodeRevealTimes[child.path] = Math.min(stepTime_safe, ToNumber(nodeRevealTimes[child.path], Number.MAX_SAFE_INTEGER));
                            }
                            // if there's another loop/depth after this one
                            if (childrenDepth < revealDepth) {
                                const childChildren = GetNodeChildren(child.node._key).map(child2 => ({ node: child2, path: child2 && `${child.path}/${child2._key}` }));
                                if (CE(childChildren).Any(a => a == null)) {
                                    // if (steps.length == 1 && steps[0]._key == 'clDjK76mSsGXicwd7emriw') debugger;
                                    return emptyArray_forLoading;
                                }
                                CE(nextChildren).AddRange(childChildren);
                            }
                        }
                        currentChildren = nextChildren;
                    }
                }
            }
            else if (reveal.hide) {
                for (const path of CE(nodeRevealTimes).VKeys()) {
                    if (path.startsWith(reveal.path)) {
                        delete nodeRevealTimes[path];
                    }
                }
            }
        }
    }
    return nodeRevealTimes;
});
export const GetNodesRevealedInSteps = StoreAccessor(s => (steps) => {
    return CE(GetNodeRevealTimesInSteps(steps)).VKeys();
});
