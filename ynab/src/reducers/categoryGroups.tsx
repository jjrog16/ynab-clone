import { QueryDocumentSnapshot } from "@firebase/firestore";

interface CategoryGroups {
  value: { arr: QueryDocumentSnapshot[] };
}

// Contains all Category Groups
const categoryGroupsReducer = (
  state: CategoryGroups = { value: { arr: [] } },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "categoryGroups/addCategoryGroup":
      return { ...state, value: { ...state.value, arr: action.payload } };
    default:
      return state;
  }
};

export default categoryGroupsReducer;
