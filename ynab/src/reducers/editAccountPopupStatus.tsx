// Handle the popups for Editing Accounts and Adding Accounts
// Controls if popup should be visible

const editAccountPopupStatusReducer = (
  state = { value: false },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "editAccountPopupStatus/disable":
      return { ...state, value: false };
    case "editAccountPopupStatus/enable":
      return { ...state, value: true };
    case "editAccountPopupStatus/toggle":
      return { ...state, value: !state };
    default:
      return state;
  }
};

export default editAccountPopupStatusReducer;
