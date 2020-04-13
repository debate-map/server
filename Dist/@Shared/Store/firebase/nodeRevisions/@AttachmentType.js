import { QuoteAttachment } from "./@QuoteAttachment";
import { MediaAttachment } from "./@MediaAttachment";
import { EquationAttachment } from "./@EquationAttachment";
import { ReferencesAttachment } from "./@ReferencesAttachment";
import { CE } from "js-vextensions";
export var AttachmentType;
(function (AttachmentType) {
    AttachmentType[AttachmentType["None"] = 10] = "None";
    // ImpactPremise = 20,
    AttachmentType[AttachmentType["Equation"] = 20] = "Equation";
    AttachmentType[AttachmentType["References"] = 30] = "References";
    AttachmentType[AttachmentType["Quote"] = 40] = "Quote";
    AttachmentType[AttachmentType["Media"] = 50] = "Media";
})(AttachmentType || (AttachmentType = {}));
export function GetAttachmentType(node) {
    return GetAttachmentType_Revision(node.current);
}
export function GetAttachmentType_Revision(revision) {
    return (revision.equation ? AttachmentType.Equation
        : revision.references ? AttachmentType.References
            : revision.quote ? AttachmentType.Quote
                : revision.media ? AttachmentType.Media
                    : AttachmentType.None);
}
export function ResetNodeRevisionAttachment(revision, attachmentType) {
    CE(revision).Extend({ equation: null, references: null, quote: null, media: null });
    if (attachmentType == AttachmentType.Equation) {
        revision.equation = new EquationAttachment();
    }
    else if (attachmentType == AttachmentType.References) {
        revision.references = new ReferencesAttachment();
    }
    else if (attachmentType == AttachmentType.Quote) {
        revision.quote = new QuoteAttachment();
    }
    else if (attachmentType == AttachmentType.Media) {
        revision.media = new MediaAttachment();
    }
}
