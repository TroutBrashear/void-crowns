 import type { Good } from '../types/gameState';

//these aren't intended as references for the functions, but are instead to be loaded into state on game start'
 export const DEFAULT_GOODS: Record<number, Good> = {
     1: {
         id: 1,
         name: "Food",
         type: "food",
         traits: []
    },
    2: {
        id: 2,
        name: "Home Goods",
        type: "homeGoods",
        traits: []
    }
}
