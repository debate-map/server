import {Assert, CachedTransform, GetValues, IsString, VURL, E, Clone, CE} from "js-vextensions";
import {SplitStringBySlash_Cached, SlicePath, StoreAccessor} from "mobx-firelink";
import {GetImage} from "../images";
import {GetNiceNameForImageType} from "../images/@Image";
import {RatingType} from "../nodeRatings/@RatingType";
import {GetNodeRevision} from "../nodeRevisions";
import {ForLink_GetError, ForNewLink_GetError, GetNode, GetNodeChildrenL2, GetNodeID, GetParentNode, GetParentNodeL2, HolderType, IsNodeSubnode, GetNodeChildrenL3} from "../nodes";
import {ChildEntry, ClaimForm, MapNode, MapNodeL2, MapNodeL3, Polarity} from "./@MapNode";
import {MapNodeRevision, TitlesMap, TitleKey_values} from "./@MapNodeRevision";
import {MapNodeType} from "./@MapNodeType";
import {PermissionGroupSet} from "../users/@User";
import {GetNodeTags, GetNodeTagComps, GetFinalTagCompsForTag} from "../nodeTags";
import {CanContributeToNode} from "../users/$user";
import {TagComp_MirrorChildrenFromXToY} from "../nodeTags/@MapNodeTag";

export function PreProcessLatex(text: string) {
	// text = text.replace(/\\term{/g, "\\text{");
	// "\term{some-term}{123}" -> "\text{@term[some-term,123]}
	//text = text.replace(/\\term{(.+?)}{([A-Za-z0-9_-]+?)}/g, (m, g1, g2)=>`\\text{@term[${g1},${g2}]}`);

	// "\term{some-term}" -> "\text{@term[some-term]}
	text = text.replace(/\\term{(.+?)}/g, (m, g1, g2)=>`\\text{@term[${g1}]}`);

	text = text.replace(/\\term/g, ()=>"[syntax wrong]"); // for user syntax mistakes, keep from causing error
	return text;
}

export function GetFontSizeForNode(node: MapNodeL2, isSubnode = false) {
	if (node.current.fontSizeOverride) return node.current.fontSizeOverride;
	if (node.current.equation) return node.current.equation.latex ? 14 : 13;
	if (isSubnode) return 11;
	return 14;
}
export function GetPaddingForNode(node: MapNodeL2, isSubnode = false) {
	return isSubnode ? "1px 4px 2px" : "5px 5px 4px";
}
export type RatingTypeInfo = {type: RatingType, main?: boolean, collapsed?: boolean};
export function GetRatingTypesForNode(node: MapNodeL2): RatingTypeInfo[] {
	if (node.type == MapNodeType.Category) {
		if (node.current.votingDisabled) return [];
		return [{type: "significance", main: true}];
	}
	if (node.type == MapNodeType.Package) {
		return [{type: "significance", main: true}];
	}
	if (node.type == MapNodeType.MultiChoiceQuestion) {
		return [{type: "significance", main: true}];
	}
	if (node.type == MapNodeType.Claim) {
		let result: RatingTypeInfo[];
		// result = [{type: "truth", main: true}]; //, {type: "significance", main: true}];
		result = [{type: "truth", main: true}]; // , {type: "relevance", main: true}];
		/* if ((node as MapNodeL2).link && (node as MapNodeL2).link.form == ClaimForm.YesNoQuestion) {
			result.Remove(result.First(a=>a.type == "significance"));
			result.Insert(0, {type: "significance", main: true});
		} */
		return result;
	}
	if (node.type == MapNodeType.Argument) {
		// return [{type: "strength", main: true}, {type: "impact", main: true}];
		return [{type: "relevance"}, {type: "impact", main: true}];
	}
	Assert(false);
}
export const GetMainRatingType = StoreAccessor(s=>(node: MapNodeL2)=>{
	return CE(GetRatingTypesForNode(node)).FirstOrX(a=>a.main, {}).type;
});
export function GetSortByRatingType(node: MapNodeL3): RatingType {
	if (node.link && node.link.form == ClaimForm.YesNoQuestion) {
		return "significance";
	}
	return GetMainRatingType(node);
}

export function ReversePolarity(polarity: Polarity) {
	return polarity == Polarity.Supporting ? Polarity.Opposing : Polarity.Supporting;
}
export const GetDisplayPolarityAtPath = StoreAccessor(s=>(node: MapNodeL2, path: string, tagsToIgnore?: string[]): Polarity=>{
	Assert(node.type == MapNodeType.Argument, "Only argument nodes have polarity.");
	const parent = GetParentNodeL2(path);
	if (!parent) return Polarity.Supporting; // can be null, if for NodeUI_ForBots

	const link = GetLinkUnderParent(node._key, parent, true, tagsToIgnore);
	if (link == null) return Polarity.Supporting; // can be null, if path is invalid (eg. copied-node path)
	Assert(link.polarity != null, `The link for the argument #${node._key} (from parent #${parent._key}) must specify the polarity.`);

	const parentForm = GetNodeForm(parent, SplitStringBySlash_Cached(path).slice(0, -1).join("/"));
	return GetDisplayPolarity(link.polarity, parentForm);
});
export function GetDisplayPolarity(basePolarity: Polarity, parentForm: ClaimForm): Polarity {
	let result = basePolarity;
	if (parentForm == ClaimForm.Negation) {
		result = ReversePolarity(result);
	}
	return result;
}
export function IsNodeL1(node): node is MapNode {
	return !node["current"];
}
export function AsNodeL1(node: MapNodeL2 | MapNodeL3) {
	const result = E(node);
	delete result.current;
	delete result["displayPolarity"];
	delete result["link"];
	return result as MapNode;
}

export function IsNodeL2(node: MapNode): node is MapNodeL2 {
	return node["current"];
}
export function AsNodeL2(node: MapNode, currentRevision: MapNodeRevision) {
	// Assert(currentRevision.titles, "A MapNodeRevision object must have a titles property!"); // temp removed (for db-upgrade)
	const result = E(node, {current: currentRevision}) as MapNodeL2;
	delete result["displayPolarity"];
	delete result["link"];
	return result;
}
export const GetNodeL2 = StoreAccessor(s=>(nodeID: string | MapNode, path?: string)=>{
	if (IsString(nodeID)) nodeID = GetNode(nodeID);
	if (nodeID == null) return null;
	const node = nodeID as MapNode;

	// if any of the data in a MapNodeL2 is not loaded yet, just return null (we want it to be all or nothing)
	const currentRevision = GetNodeRevision(node.currentRevision);
	if (currentRevision === undefined) return undefined;

	const nodeL2 = AsNodeL2(node, currentRevision);
	//return CachedTransform("GetNodeL2", [path], nodeL2, ()=>nodeL2);
	return nodeL2;
});

export function IsNodeL3(node: MapNode): node is MapNodeL3 {
	return node["displayPolarity"] && node["link"];
}
export function AsNodeL3(node: MapNodeL2, displayPolarity?: Polarity, link?: ChildEntry) {
	displayPolarity = displayPolarity || Polarity.Supporting;
	link = link || {
		_: true,
		form: ClaimForm.Base,
		seriesAnchor: false,
		polarity: Polarity.Supporting,
	};
	return E(node, {displayPolarity, link}) as MapNodeL3;
}
export const GetNodeL3 = StoreAccessor(s=>(path: string, tagsToIgnore?: string[])=>{
	if (path == null) return null;
	const nodeID = GetNodeID(path);
	const node = GetNodeL2(nodeID);
	if (node == null) return null;

	// if any of the data in a MapNodeL3 is not loaded yet, just return null (we want it to be all or nothing)
	let displayPolarity = null;
	if (node.type == MapNodeType.Argument) {
		displayPolarity = GetDisplayPolarityAtPath(node, path, tagsToIgnore);
		if (displayPolarity == null) return null;
	}

	const isSubnode = IsNodeSubnode(node);
	if (!isSubnode) {
		const parent = GetParentNode(path);
		if (parent == null && path.includes("/")) return null;
		var link = GetLinkUnderParent(node._key, parent, true, tagsToIgnore);
		if (link == null && path.includes("/")) return null;
	}

	const nodeL3 = AsNodeL3(node, displayPolarity, link);
	// return CachedTransform('GetNodeL3', [path], nodeL3, () => nodeL3);
	return nodeL3;
});

/* export function GetNodeForm(node: MapNode, path: string): ClaimForm {
	let parent = GetParentNode(path);
	return GetNodeForm(node, parent);
}
export function GetClaimFormUnderParent(node: MapNode, parent: MapNode): ClaimForm {
	let link = GetLinkUnderParent(node._id, parent);
	if (link == null) return ClaimForm.Base;
	return link.form;
} */
export const GetNodeForm = StoreAccessor(s=>(node: MapNodeL2 | MapNodeL3, pathOrParent?: string | MapNodeL2): ClaimForm=>{
	if (IsNodeL3(node)) {
		return node.link.form;
	}

	const parent: MapNodeL2 = IsString(pathOrParent) ? GetParentNodeL2(pathOrParent as string) : pathOrParent as MapNodeL2;
	const link = GetLinkUnderParent(node._key, parent);
	if (link == null) return ClaimForm.Base;
	return link.form;
});
export const GetLinkUnderParent = StoreAccessor(s=>(nodeID: string, parent: MapNode, includeMirrorLinks = true, tagsToIgnore?: string[]): ChildEntry=>{
	if (parent == null) return null;
	let link = parent.children?.[nodeID]; // null-check, since after child-delete, parent-data might have updated before child-data removed
	if (includeMirrorLinks && link == null) {
		let tags = GetNodeTags(parent._key).filter(tag=>tag && !tagsToIgnore?.includes(tag._key));
		for (const tag of tags) {
			//let tagComps = GetNodeTagComps(parent._key);
			const tagComps = GetFinalTagCompsForTag(tag);
			for (const comp of tagComps) {
				if (comp instanceof TagComp_MirrorChildrenFromXToY && comp.nodeY == parent._key) {
					let mirrorChildren = GetNodeChildrenL3(comp.nodeX, undefined, undefined, (tagsToIgnore ?? []).concat(tag._key));
					mirrorChildren = mirrorChildren.filter(child=> {
						return child && ((child.link.polarity == Polarity.Supporting && comp.mirrorSupporting) || (child.link.polarity == Polarity.Opposing && comp.mirrorOpposing));
					});
					let nodeL3ForNodeAsMirrorChildInThisTag = mirrorChildren.find(a=>a._key == nodeID);
					//const nodeL3ForNodeAsMirrorChildInThisTag = GetNodeL3(`${comp.nodeX}/${nodeID}`);
					if (nodeL3ForNodeAsMirrorChildInThisTag) {
						link = Clone(nodeL3ForNodeAsMirrorChildInThisTag.link);
						Object.defineProperty(link, "_mirrorLink", {value: true});
						if (comp.reversePolarities) {
							link.polarity = ReversePolarity(link.polarity);
						}
					}
				}
			}
		}
	}
	return link;
});
export function GetLinkAtPath(path: string) {
	const nodeID = GetNodeID(path);
	const parent = GetNode(GetNodeID(SlicePath(path, 1)));
	return GetLinkUnderParent(nodeID, parent);
}

export class NodeContributionInfo {
	constructor(nodeID: string) {
		this.proArgs = new NodeContributionInfo_ForPolarity(nodeID);
		this.conArgs = new NodeContributionInfo_ForPolarity(nodeID);
	}
	proArgs: NodeContributionInfo_ForPolarity;
	conArgs: NodeContributionInfo_ForPolarity;
}
export class NodeContributionInfo_ForPolarity {
	constructor(nodeID: string) {
		this.hostNodeID = nodeID;
	}
	canAdd = true;
	hostNodeID: string;
	reversePolarities = false;
}
export function GetPolarityShortStr(polarity: Polarity) {
	return polarity == Polarity.Supporting ? "pro" : "con";
}

export const GetNodeContributionInfo = StoreAccessor(s=>(nodeID: string, userID: string)=> {
	let result = new NodeContributionInfo(nodeID);
	let tags = GetNodeTags(nodeID);
	let directChildrenDisabled = CE(tags).Any(a=>a.mirrorChildrenFromXToY?.nodeY == nodeID && a.mirrorChildrenFromXToY?.disableDirectChildren);
	if (directChildrenDisabled) {
		result.proArgs.canAdd = false;
		result.conArgs.canAdd = false;
	}
	for (let tag of tags) {
		if (tag.mirrorChildrenFromXToY && tag.mirrorChildrenFromXToY.nodeY == nodeID) {
			let comp = tag.mirrorChildrenFromXToY;
			let addForPolarities_short = [] as ("pro" | "con")[];
			if (comp.mirrorSupporting) addForPolarities_short.push(comp.reversePolarities ? "con" : "pro");
			if (comp.mirrorOpposing) addForPolarities_short.push(comp.reversePolarities ? "pro" : "con");
			for (let polarity_short of addForPolarities_short) {
				result[`${polarity_short}Args`].canAdd = true;
				result[`${polarity_short}Args`].hostNodeID = comp.nodeX;
				result[`${polarity_short}Args`].reversePolarities = comp.reversePolarities;
			}
		}
	}
	if (!CanContributeToNode(userID, result.proArgs.hostNodeID)) result.proArgs.canAdd = false;
	if (!CanContributeToNode(userID, result.conArgs.hostNodeID)) result.conArgs.canAdd = false;
	return result;
});

export function IsNodeTitleValid_GetError(node: MapNode, title: string) {
	if (title.trim().length == 0) return "Title cannot be empty.";
	return null;
}

export function GetAllNodeRevisionTitles(nodeRevision: MapNodeRevision): string[] {
	if (nodeRevision == null || nodeRevision.titles == null) return [];
	return TitleKey_values.map(key=>nodeRevision.titles[key]).filter(a=>a != null);
}

/** Gets the main display-text for a node. (doesn't include equation explanation, quote sources, etc.) */
export const GetNodeDisplayText = StoreAccessor(s=>(node: MapNodeL2, path?: string, form?: ClaimForm): string=>{
	form = form || GetNodeForm(node, path);
	const titles = node.current.titles || {} as TitlesMap;

	// if (path && path.split('/').length > 3) throw new Error('Test1'); // for testing node error-boundaries

	if (node.type == MapNodeType.Argument && !node.multiPremiseArgument && !titles.base) {
		// const baseClaim = GetNodeL2(node.children && node.children.VKeys().length ? node.children.VKeys()[0] : null);
		// const baseClaim = GetArgumentPremises(node)[0];
		const baseClaim = GetNodeChildrenL2(node._key).filter(a=>a && a.type == MapNodeType.Claim)[0];
		if (baseClaim) return GetNodeDisplayText(baseClaim);
	}
	if (node.type == MapNodeType.Claim) {
		if (node.current.equation) {
			let result = node.current.equation.text;
			//if (node.current.equation.latex && !isBot) {
			if (node.current.equation.latex && typeof window != "undefined" && window["katex"] && window["$"]) {
				// result = result.replace(/\\[^{]+/g, "").replace(/[{}]/g, "");
				const latex = PreProcessLatex(result);
				try {
					const html = window["katex"].renderToString(latex) as string;
					const dom = window["$"](html).children(".katex-html");
					result = dom.text();
				} catch (ex) {
					if (ex.message.startsWith("KaTeX parse error: ")) {
						return ex.message.replace(/^KaTeX/, "LaTeX");
					}
				}
			}
			return result;
		}
		if (node.current.quote) {
			const firstSource = node.current.quote.sourceChains[0].sources[0];
			// if (PROD && firstSource == null) return '(first source is null)'; // defensive
			return `The statement below was made${ // (as shown)
				firstSource.name ? ` in "${firstSource.name}"` : ""}${
					firstSource.author ? ` by ${firstSource.author}` : ""}${
						firstSource.link ? ` at "${VURL.Parse(firstSource.link, false).toString({domain_protocol: false})}"` : "" // maybe temp
			}.`;
		}
		if (node.current.image) {
			const image = GetImage(node.current.image.id);
			if (image == null) return "...";
			// if (image.sourceChains == null) return `The ${GetNiceNameForImageType(image.type)} below is unmodified.`; // temp
			const firstSource = image.sourceChains[0].sources[0];
			return `The ${GetNiceNameForImageType(image.type)} below was published${ // (as shown)`
				firstSource.name ? ` in "${firstSource.name}"` : ""}${
					firstSource.author ? ` by ${firstSource.author}` : ""}${
						firstSource.link ? ` at "${VURL.Parse(firstSource.link, false).toString({domain_protocol: false})}"` : "" // maybe temp
			}.`;
		}

		if (form) {
			if (form == ClaimForm.Negation) return titles.negation || missingTitleStrings[1];
			if (form == ClaimForm.YesNoQuestion) return titles.yesNoQuestion || missingTitleStrings[2];
		}
	}
	return titles.base || missingTitleStrings[0];
});
export const missingTitleStrings = ["(base title not set)", "(negation title not set)", "(question title not set)"];

export function GetValidChildTypes(nodeType: MapNodeType, path: string) {
	const nodeTypes = GetValues<MapNodeType>(MapNodeType);
	const validChildTypes = nodeTypes.filter(type=>ForLink_GetError(nodeType, type) == null);
	return validChildTypes;
}
export function GetValidNewChildTypes(parent: MapNodeL2, holderType: HolderType, permissions: PermissionGroupSet) {
	const nodeTypes = GetValues<MapNodeType>(MapNodeType);
	const validChildTypes = nodeTypes.filter(type=>ForNewLink_GetError(parent._key, {type} as any, permissions, holderType) == null);
	return validChildTypes;
}

/** Returns whether the node provided is an argument, and marked as single-premise. */
export const IsSinglePremiseArgument = StoreAccessor(s=>(node: MapNode)=>{
	/* nodeChildren = nodeChildren || GetNodeChildren(node);
	if (nodeChildren.Any(a=>a == null)) return null;
	//return nodeChildren.Any(child=>IsPremiseOfSinglePremiseArgument(child, node));
	return node.type == MapNodeType.Argument && nodeChildren.filter(a=>a.type == MapNodeType.Claim).length == 1; */
	return node && node.type == MapNodeType.Argument && !node.multiPremiseArgument;
});
/** Returns whether the node provided is an argument, and marked as multi-premise. */
export const IsMultiPremiseArgument = StoreAccessor(s=>(node: MapNode)=>{
	/* nodeChildren = nodeChildren || GetNodeChildren(node);
	if (nodeChildren.Any(a=>a == null)) return null;
	//return node.type == MapNodeType.Argument && !IsSinglePremiseArgument(node, nodeChildren);
	return node.type == MapNodeType.Argument && nodeChildren.filter(a=>a.type == MapNodeType.Claim).length > 1; */
	return node && node.type == MapNodeType.Argument && node.multiPremiseArgument;
});

export const IsPremiseOfSinglePremiseArgument = StoreAccessor(s=>(node: MapNode, parent: MapNode)=>{
	if (parent == null) return null;
	// let parentChildren = GetNodeChildrenL2(parent);
	/* if (parentChildren.Any(a=>a == null)) return false;
	return node.type == MapNodeType.Claim && parentChildren.filter(a=>a.type == MapNodeType.Claim).length == 1 && node.link.form != ClaimForm.YesNoQuestion; */
	//let node = GetNode(nodeID);
	return node.type == MapNodeType.Claim && IsSinglePremiseArgument(parent);
});
export function IsPremiseOfMultiPremiseArgument(node: MapNode, parent: MapNode) {
	if (parent == null) return null;
	// let parentChildren = GetNodeChildrenL2(parent);
	//let node = GetNode(nodeID);
	return node.type == MapNodeType.Claim && IsMultiPremiseArgument(parent);
}