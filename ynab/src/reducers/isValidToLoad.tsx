const isValidToLoadReducer = (
  state = { value: true },
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
