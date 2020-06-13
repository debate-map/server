export declare class Term {
    constructor(initialData: {
        name: string;
        type: TermType;
    } & Partial<Term>);
    _key?: string;
    creator: string;
    createdAt: number;
    name: string;
    forms: string[];
    disambiguation: string;
    type: TermType;
    definition: string;
    note: string;
}
export declare const Term_nameFormat = "^[a-zA-Z0-9 ,'\"%-]+$";
export declare const Term_formsEntryFormat = "^[^A-Z]+$";
export declare const Term_disambiguationFormat = "^[a-zA-Z0-9 ,'\"%-\\/]+$";
export declare const Term_definitionFormat = "^(.|\n)+$";
export declare enum TermType {
    CommonNoun = 10,
    ProperNoun = 20,
    Adjective = 30,
    Verb = 40,
    Adverb = 50
}
