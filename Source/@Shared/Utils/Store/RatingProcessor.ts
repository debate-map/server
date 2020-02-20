import {emptyObj, IsNumber, Assert, CE, emptyArray_forLoading, emptyArray} from "js-vextensions";
import {StoreAccessor} from "mobx-firelink";
import {GetRatingAverage, GetRatingValue, GetRatings} from "../../Store/firebase/nodeRatings";
import {Rating} from "../../Store/firebase/nodeRatings/@Rating";
import {GetMainRatingType, GetNodeForm, GetRatingTypesForNode} from "../../Store/firebase/nodes/$node";
import {ClaimForm, MapNodeL2} from "../../Store/firebase/nodes/@MapNode";
import {ArgumentType} from "../../Store/firebase/nodes/@MapNodeRevision";

export const GetArgumentImpactPseudoRating = StoreAccessor(s=>(argument: MapNodeL2, premises: MapNodeL2[], userID: string): Rating=>{
	if (CE(premises).Any(a=>a == null)) return null; // must still be loading
	if (premises.length == 0) return null;

	const premiseProbabilities = premises.map(premise=>{
		const ratingType = GetRatingTypesForNode(premise)[0].type;
		let ratingValue = GetRatingValue(premise._key, ratingType, userID, null);
		// if user didn't rate this premise, just use the average rating
		if (ratingValue == null) {
			ratingValue = GetRatingAverage(premise._key, ratingType, null) || 0;
		}

		const form = GetNodeForm(premise, argument);
		const probability = form == ClaimForm.Negation ? 1 - (ratingValue / 100) : (ratingValue / 100);
		return probability;
	});
	let combinedTruthOfPremises;
	if (argument.current.argumentType == ArgumentType.All) {
		combinedTruthOfPremises = premiseProbabilities.reduce((total, current)=>total * current, 1);
	} else if (argument.current.argumentType == ArgumentType.AnyTwo) {
		const strongest = CE(premiseProbabilities).Max(null, true);
		const secondStrongest = premiseProbabilities.length > 1 ? CE(CE(premiseProbabilities).Except({excludeEachOnlyOnce: true}, strongest)).Max(null, true) : 0;
		combinedTruthOfPremises = strongest * secondStrongest;
	} else {
		combinedTruthOfPremises = CE(premiseProbabilities).Max(null, true);
	}

	let relevance = GetRatingValue(argument._key, "relevance", userID, null);
	// if user didn't rate the relevance, just use the average rating
	if (relevance == null) {
		relevance = GetRatingAverage(argument._key, "relevance", null) || 0;
	}
	// let strengthForType = adjustment.Distance(50) / 50;
	const result = combinedTruthOfPremises * (relevance / 100);
	Assert(IsNumber(result), `Impact pseudo-rating is null. @combinedTruthOfPremises:${combinedTruthOfPremises} @relevance:${relevance}`);

	return {
		//_key: userID,
		node: argument._key,
		type: "impact",
		user: userID,
		updated: null,
		value: CE(result * 100).RoundTo(1),
	};
});
// export function GetArgumentStrengthEntries(nodeChildren: MapNode[], users: string[]) {
/* export function GetArgumentStrengthPseudoRatings(nodeChildren: MapNode[]): Rating[] {
	if (nodeChildren.Any(a=>a == null)) return []; // must still be loading
	let impactPremise = nodeChildren.First(a=>a.impactPremise != null);
	let premises = nodeChildren.Except(impactPremise);
	if (premises.length == 0) return [];

	let usersWhoRated = nodeChildren.SelectMany(child=>GetRatings(child._id, MapNode.GetMainRatingTypes(child)[0]).map(a=>a._key)).Distinct();
	let result = usersWhoRated.map(userID=>GetArgumentStrengthPseudoRating(nodeChildren, userID));
	return result;
} */

// export function GetArgumentImpactPseudoRatingSet(argument: MapNodeL2, premises: MapNodeL2[]): {[key: string]: Rating} {
export const GetArgumentImpactPseudoRatings = StoreAccessor(s=>(argument: MapNodeL2, premises: MapNodeL2[]): Rating[]=>{
	if (CE(premises).Any(a=>a == null)) return emptyArray_forLoading as any; // must still be loading
	if (premises.length == 0) return emptyArray as any;

	const childForms_map = CE(premises).ToMap((child, index)=>`childForm_${index}`, child=>{
		return GetNodeForm(child, argument);
	});
	// let dataUsedInCalculation = {...childRatingSets, ...childForms_map};
	const dataUsedInCalculation = {...childForms_map} as any;
	dataUsedInCalculation.argumentType = argument.current.argumentType;

	const usersWhoRatedArgOrPremise = {};
	/* const argRatingSet = GetRatingSet(argument._key, GetMainRatingType(argument)) || emptyObj;
	for (const userID of argRatingSet.VKeys()) {
		usersWhoRatedArgOrPremise[userID] = true;
	} */
	for (const userID of GetRatings(argument._key, "relevance").map(a=>a.user)) {
		usersWhoRatedArgOrPremise[userID] = true;
	}
	for (const premise of premises) {
		for (const userID of GetRatings(premise._key, "truth").map(a=>a.user)) {
			usersWhoRatedArgOrPremise[userID] = true;
		}
	}

	for (const child of premises) {
		const childRatings = GetRatings(child._key, GetMainRatingType(child));
		//for (const userID of childRatingSet.VKeys()) {
		for (const userID of childRatings.map(a=>a.user)) {
			usersWhoRatedArgOrPremise[userID] = true;
		}
	}

	const result = [] as Rating[];
	for (const userID of CE(usersWhoRatedArgOrPremise).VKeys()) {
		result.push(GetArgumentImpactPseudoRating(argument, premises, userID));
	}
	return result;
	/* });
	return result; */
});

/* export function CalculateArgumentStrength(nodeChildren: MapNode[]) {
	if (nodeChildren.Any(a=>a == null)) return 0; // must still be loading
	let impactPremise = nodeChildren.First(a=>a.impactPremise != null);
	let premises = nodeChildren.Except(impactPremise);
	if (premises.length == 0) return 0;

	let premiseProbabilities = premises.map(child=>GetRatingAverage(child._id, "probability", 0) / 100);
	let all = impactPremise.impactPremise.ifType == ImpactPremise_IfType.All;
	let combinedProbabilityOfPremises = all
		? premiseProbabilities.reduce((total, current)=>total * current, 1)
		: premiseProbabilities.Max(null, true);

	if (impactPremise.impactPremise.thenType == ImpactPremise_ThenType.StrengthenParent || impactPremise.impactPremise.thenType == ImpactPremise_ThenType.WeakenParent) {
		let averageAdjustment = GetRatingAverage(impactPremise._id, "adjustment", 50);
		let strengthForType = averageAdjustment.Distance(50) / 50;
		var result = combinedProbabilityOfPremises * strengthForType;
	} else {
		var result = combinedProbabilityOfPremises * (GetRatingAverage(impactPremise._id, "probability", 0) / 100);
	}
	return (result * 100).RoundTo(1);
} */