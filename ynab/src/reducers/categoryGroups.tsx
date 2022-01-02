import { QueryDocumentSnapshot } from "@firebase/firestore";

// Contains all Category Groups
const categoryGroupsReducer = (
  state: QueryDocumentSnapshot[] = [],
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "ADD_CATEGORY_GROUP":
      return [...state, action.payload];
  }
};

export default categoryGroupsReducer;
