// The default state for the working balance input field inside the EditAccountPopup component
const editAccountWorkingBalanceInputReducer = (
  state = { value: "" },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "editAccountWorkingBalanceInput/updateInputValue":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default editAccountWorkingBalanceInputReducer;
