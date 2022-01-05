// Keep track of the total amount of money available from all bank accounts
interface MoneyTotalAmount {
  value: number;
}
const moneyAmountTotalReducer = (
  state: MoneyTotalAmount = { value: 0 },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "moneyAccountTotal/addToTotal":
      return { ...state, value: state + action.payload };
    default:
      return state;
  }
};

export default moneyAmountTotalReducer;
