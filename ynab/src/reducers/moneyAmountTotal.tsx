// Keep track of the total amount of money available from all bank accounts

const moneyAmountTotalReducer = (
  state = 0,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "ADD_TO_TOTAL":
      return state + action.payload;
  }
};

export default moneyAmountTotalReducer;
