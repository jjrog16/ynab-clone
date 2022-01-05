import { QueryDocumentSnapshot } from "@firebase/firestore";

interface Categories {
  value: { arr: QueryDocumentSnapshot[] };
}

// Contains all Categories
const categoriesReducer = (
  state: Categories = { value: { arr: [] } },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "categories/addCategory":
      return { ...state, value: { ...state.value, arr: action.payload } };
    default:
      return state;
  }
};

export default categoriesReducer;
