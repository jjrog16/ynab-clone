// Keep track of the total amount of money from a Category Group

const categoryGroupAmountTotalReducer = (
  state = { value: 0 },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "categoryGroupAmountTotal/addToTotal":
      return { ...state, value: state + action.payload };
    default:
      return state;
  }
};

export default categoryGroupAmountTotalReducer;
