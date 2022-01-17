// Keep track of the total amount of money from a Category Group

import { title } from "process";

const categoryGroupAmountTotalReducer = (
  state = {
    value: [{ title: "", available: 0, position: 0 }],
  },
  action: {
    type: string;
    payload: {
      title: string;
      available: number;
      position: number;
      index: number;
    };
  }
) => {
  switch (action.type) {
    case "categoryGroupAmountTotal/addToTotal":
      return { ...state, value: [...state.value, action.payload] };
    case "categoryGroupAmountTotal/remove":
      return {
        ...state,
        value: [
          ...state.value.slice(0, action.payload.index),
          ...state.value.slice(action.payload.index + 1),
        ],
      };
    case "categoryGroupAmountTotal/update":
      return {
        ...state,
        value: [
          ...state.value.slice(0, action.payload.index),
          (state.value[action.payload.index] = {
            title: action.payload.title,
            available: action.payload.available,
            position: action.payload.position,
          }),
          ...state.value.slice(action.payload.index + 1),
        ],
      };
    default:
      return state;
  }
};

export default categoryGroupAmountTotalReducer;
