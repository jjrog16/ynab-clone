// The default state for the account name input field inside the EditAccountPopup component

const editAccountNameInputReducer = (
  state = "",
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "UPDATE_INPUT_VALUE":
      return (state = action.payload);
  }
};

export default editAccountNameInputReducer;
