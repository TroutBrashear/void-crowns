//state for economy and resources


//------------ECONOMY------------------
export interface Resources {
    credits: number;
    rocks: number;
    gas: number;
}

export type GoodCategory = 'food' | 'homeGoods';

export interface Good {
    readonly id: number;
    name: string;
    type: GoodCategory;
    traits: string[];
}
