import { DEL, E, Clone, CE } from "js-vextensions";
import { MergeDBUpdates, SplitStringBySlash_Cached, Command, AssertV, AV } from "mobx-firelink";
import { AddChildNode } from "./AddChildNode";
import { LinkNode } from "./LinkNode";
import { GetNodeL2, GetNodeForm, GetLinkAtPath } from "../Store/firebase/nodes/$node";
import { MapNodeType } from "../Store/firebase/nodes/@MapNodeType";
export class CloneNode extends Command {
    Validate() {
        var _a;
        const { mapID, baseNodePath, newParentID } = this.payload;
        // prepare add-node
        // ==========
        const baseNodeID = CE(SplitStringBySlash_Cached(baseNodePath)).Last();
        const baseNode = AV.NonNull = GetNodeL2(baseNodeID);
        const isArgument = baseNode.type == MapNodeType.Argument;
        const nodeForm = AV.NonNull = GetNodeForm(baseNode, baseNodePath);
        const nodePolarity = AV.NonNull = GetLinkAtPath(baseNodePath).polarity;
        const newChildNode = Clone(baseNode).VSet({ children: DEL, childrenOrder: DEL, currentRevision: DEL, current: DEL, parents: DEL });
        const newChildRevision = Clone(baseNode.current).VSet({ node: DEL });
        this.sub_addNode = (_a = this.sub_addNode, (_a !== null && _a !== void 0 ? _a : new AddChildNode({
            mapID, parentID: newParentID, node: newChildNode, revision: newChildRevision,
            link: E({ _: true }, nodeForm && { form: nodeForm }, nodePolarity && { polarity: nodePolarity }),
        }).MarkAsSubcommand(this)));
        this.sub_addNode.Validate();
        // prepare link-children
        // ==========
        let childrenToLink = CE(baseNode.children || {}).VKeys();
        if (isArgument) {
            // if argument, use childrenOrder instead, since it's sorted
            childrenToLink = (baseNode.childrenOrder || []).slice();
            CE(childrenToLink).Remove(baseNode.childrenOrder[0]); // but don't link old-impact-premise
        }
        this.sub_linkChildren = [];
        for (const childID of childrenToLink) {
            const child = GetNodeL2(childID);
            AssertV(child, `child (for id ${childID}) is null.`);
            const childForm = GetNodeForm(child, `${baseNodePath}/${childID}`);
            AssertV(child, `childForm (for id ${childID}) is null.`);
            const linkChildSub = new LinkNode({ mapID, parentID: this.sub_addNode.sub_addNode.nodeID, childID, childForm }).MarkAsSubcommand(this);
            // linkChildSub.Prepare([]);
            /* let dbUpdates = this.GetDBUpdates();
            let node_childrenOrder = dbUpdates[`nodes/${this.sub_addNode.nodeID}/childrenOrder`];
            linkChildSub.Prepare(node_childrenOrder); */
            this.sub_linkChildren.push(linkChildSub);
        }
        this.returnData = this.sub_addNode.returnData;
        this.sub_addNode.Validate();
        for (const sub of this.sub_linkChildren) {
            sub.Validate();
        }
    }
    GetDBUpdates() {
        let updates = this.sub_addNode.GetDBUpdates();
        for (const sub of this.sub_linkChildren) {
            // updates.Extend(sub.GetDBUpdates());
            updates = MergeDBUpdates(updates, sub.GetDBUpdates());
        }
        // override the setting of new-node/childrenOrder (otherwise each link-node sub-command tries to set it to: [old-list] + [its-own-child])
        // updates[`nodes/${this.sub_addNode.nodeID}/childrenOrder`] = this.sub_linkChildren.map(a=>a.payload.childID);
        if (this.sub_addNode.payload.node.type == MapNodeType.Argument) {
            const childrenOrder = [];
            childrenOrder.push(...this.sub_linkChildren.map(a => a.payload.childID));
            updates[`nodes/${this.sub_addNode.sub_addNode.nodeID}`].childrenOrder = childrenOrder;
        }
        return updates;
    }
}
