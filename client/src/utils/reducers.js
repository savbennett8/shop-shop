import { useReducer } from "react";
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from "./actions";

export const reducer = (state, action) => {
    switch (action.type) {
        //if action type value is the value of 'UPDATE_PRODUCTS', return a new
        //------state object w/an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };

        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };

        //otherwise, don't update state at all
        default:
            return state;
    }
};

//helps initialize global state object & provides functionality for updating
//-----state by running it through the reducer function
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
};