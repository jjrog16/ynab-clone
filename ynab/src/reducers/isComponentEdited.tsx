const isComponentEditedReducer = (
  state = { value: true },
  action: { type: string; payload: boolean }
) => {
  switch (action.type) {
    case "isComponentEdited/setState":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default isComponentEditedReducer;
