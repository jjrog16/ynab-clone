// Keep track of the total amount of money from a Category Group

const categoryGroupAmountTotalReducer = (
  state = 0,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "ADD_TO_TOTAL":
      return state + action.payload;
  }
};

export default categoryGroupAmountTotalReducer;
