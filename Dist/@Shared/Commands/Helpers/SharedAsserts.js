import { AssertV } from "mobx-firelink";
import { IsUserCreatorOrMod } from "../../../Link";
export function AssertExistsAndUserIsCreatorOrMod(command, entity, act = "modify or delete") {
    AssertV(entity, "Entry does not exist.");
    AssertV(IsUserCreatorOrMod(command.userInfo.id, entity), `You do not have permission to ${act} this entry.`);
}
