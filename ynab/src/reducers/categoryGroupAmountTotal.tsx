// Keep track of the total amount of money from a Category Group

const categoryGroupAmountTotalReducer = (
  state = {
    value: [{ title: "", available: 0 }],
  },
  action: { type: string; payload: { title: string; available: number } }
) => {
  switch (action.type) {
    case "categoryGroupAmountTotal/addToTotal":
      return { ...state, value: [...state.value, action.payload] };
    default:
      return state;
  }
};

export default categoryGroupAmountTotalReducer;
