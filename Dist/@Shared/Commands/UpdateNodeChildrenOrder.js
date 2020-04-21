var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MapEdit, UserEdit } from "../CommandMacros";
import { AssertValidate } from "mobx-firelink";
import { Command, AssertV } from "mobx-firelink";
import { GetNode } from "../Store/firebase/nodes";
import { HasAdminPermissions, IsUserCreatorOrMod } from "../Store/firebase/users/$user";
import { IsPrivateNode, IsMultiPremiseArgument } from "../Store/firebase/nodes/$node";
let UpdateNodeChildrenOrder = class UpdateNodeChildrenOrder extends Command {
    Validate() {
        AssertValidate({
            properties: {
                mapID: { type: "string" },
                nodeID: { type: "string" },
                childrenOrder: { items: { type: "string" } },
            },
            required: ["nodeID", "childrenOrder"],
        }, this.payload, "Payload invalid");
        const { mapID, nodeID, childrenOrder } = this.payload;
        const node = this.oldNodeData = GetNode(nodeID);
        AssertV(this.oldNodeData, "oldNodeData is null.");
        const changeableForNonAdmins = IsPrivateNode(node) || IsMultiPremiseArgument(node);
        const changeable_final = (IsUserCreatorOrMod(this.userInfo.id, node) && changeableForNonAdmins) || HasAdminPermissions(this.userInfo.id);
        AssertV(changeable_final, "You don't have permission to change this node's children-order.");
        this.newNodeData = Object.assign(Object.assign({}, this.oldNodeData), { childrenOrder });
        AssertValidate("MapNode", this.newNodeData, "New node-data invalid");
    }
    GetDBUpdates() {
        const { nodeID } = this.payload;
        const updates = {};
        updates[`nodes/${nodeID}`] = this.newNodeData;
        return updates;
    }
};
UpdateNodeChildrenOrder = __decorate([
    MapEdit,
    UserEdit
], UpdateNodeChildrenOrder);
export { UpdateNodeChildrenOrder };
