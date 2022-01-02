// Handles visibility for editComponentPopup
const editComponentPopupStatusReducer = (
  state = false,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "DISABLE":
      return (state = false);
    case "ENABLE":
      return (state = true);
    case "TOGGLE":
      return !state;
  }
};

export default editComponentPopupStatusReducer;
