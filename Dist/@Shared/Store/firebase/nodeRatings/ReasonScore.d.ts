export declare const RS_CalculateTruthScore: ((claimID: string, calculationPath?: string[]) => number) & {
    Wait: (claimID: string, calculationPath?: string[]) => number;
};
export declare const RS_CalculateTruthScoreComposite: ((argumentID: string, calculationPath?: string[]) => number) & {
    Wait: (argumentID: string, calculationPath?: string[]) => number;
};
export declare const RS_CalculateBaseWeight: ((claimID: string, calculationPath?: string[]) => number) & {
    Wait: (claimID: string, calculationPath?: string[]) => number;
};
export declare const RS_CalculateWeightMultiplier: ((nodeID: string, calculationPath?: string[]) => number) & {
    Wait: (nodeID: string, calculationPath?: string[]) => number;
};
export declare const RS_CalculateWeight: ((argumentID: string, premiseIDs: string[], calculationPath?: string[]) => number) & {
    Wait: (argumentID: string, premiseIDs: string[], calculationPath?: string[]) => number;
};
export declare type ReasonScoreValues = {
    argument: any;
    premises: any;
    argTruthScoreComposite: any;
    argWeightMultiplier: any;
    argWeight: any;
    claimTruthScore: any;
    claimBaseWeight: any;
};
export declare type ReasonScoreValues_RSPrefix = {
    argument: any;
    premises: any;
    rs_argTruthScoreComposite: any;
    rs_argWeightMultiplier: any;
    rs_argWeight: any;
    rs_claimTruthScore: any;
    rs_claimBaseWeight: any;
};
export declare const RS_GetAllValues: ((nodeID: string, path: string, useRSPrefix?: boolean, calculationPath?: string[]) => any) & {
    Wait: (nodeID: string, path: string, useRSPrefix?: boolean, calculationPath?: string[]) => any;
};
