const isValidToLoadReducer = (
  state = { value: false },
  action: { type: string; payload: boolean }
) => {
  switch (action.type) {
    case "isValidToLoad/setState":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default isValidToLoadReducer;
