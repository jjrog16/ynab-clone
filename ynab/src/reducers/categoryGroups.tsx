import { QueryDocumentSnapshot } from "@firebase/firestore";

interface CategoryGroups {
  value: QueryDocumentSnapshot[];
}

// Contains all Category Groups
const categoryGroupsReducer = (
  state: CategoryGroups = { value: [] },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "categoryGroups/addCategoryGroup":
      return { ...state, value: [...state.value, action.payload] };
    default:
      return state;
  }
};

export default categoryGroupsReducer;
