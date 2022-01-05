// Keep track of the ready to assign amount and recalculate when sections are deleted

const readyToAssignTotalReducer = (
  state = { value: 0 },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "readyToAssignTotal/addToTotal":
      return { ...state, value: state + action.payload };
    default:
      return state;
  }
};

export default readyToAssignTotalReducer;
