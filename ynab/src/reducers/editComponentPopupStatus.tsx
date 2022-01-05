// Handles visibility for editComponentPopup
const editComponentPopupStatusReducer = (
  state = { value: false },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "editComponentPopupStatus/disable":
      return { ...state, value: false };
    case "editComponentPopupStatus/enable":
      return { ...state, value: true };
    case "editComponentPopupStatus/toggle":
      return { ...state, value: !state };
    default:
      return state;
  }
};

export default editComponentPopupStatusReducer;
