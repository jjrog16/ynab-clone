// The default state for the account name input field inside the EditAccountPopup component

const editAccountNameInputReducer = (
  state = { value: "" },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "editAccountNumberInput/updateInputValue":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default editAccountNameInputReducer;
