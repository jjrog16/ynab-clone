// Handle the popups for Editing Accounts and Adding Accounts
// Controls if popup should be visible

const editAccountPopupStatusReducer = (
  state = false,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "DISABLE":
      return (state = false);
    case "ENABLE":
      return (state = true);
    case "TOGGLE":
      return !state;
  }
};

export default editAccountPopupStatusReducer;
