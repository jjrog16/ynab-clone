// Keep track of the ready to assign amount and recalculate when sections are deleted

const readyToAssignTotalReducer = (
  state = 0,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "ADD_TO_TOTAL":
      return state + action.payload;
  }
};

export default readyToAssignTotalReducer;
