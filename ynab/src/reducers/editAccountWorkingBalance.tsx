// The default state for the working balance input field inside the EditAccountPopup component
const editAccountWorkingBalanceInputReducer = (
  state = "",
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "UPDATE_INPUT_VALUE":
      return (state = action.payload);
  }
};

export default editAccountWorkingBalanceInputReducer;
