import { ClaimForm, MapNode, Polarity } from "./@MapNode";
export declare enum MapNodeType {
    Category = 10,
    Package = 20,
    MultiChoiceQuestion = 30,
    Claim = 40,
    Argument = 50
}
export declare class MapNodeType_Info {
    static for: {
        [key: string]: MapNodeType_Info;
    };
    private constructor();
    childTypes: MapNodeType[];
    minWidth: number;
    maxWidth: number;
}
export declare function GetMapNodeTypeDisplayName(type: MapNodeType, parentNode: MapNode, parentNodeForm: ClaimForm, polarity: Polarity): "category" | "package" | "multi-choice question" | "claim (in question form)" | "claim" | "supporting argument" | "opposing argument";
