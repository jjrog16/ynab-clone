// Controls visibility for AddComponent
const addComponentPopupStatusReducer = (
  state = { value: false },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "addComponentPopupStatus/disable":
      return { ...state, value: false };
    case "addComponentPopupStatus/enable":
      return { ...state, value: true };
    case "addComponentPopupStatus/toggle":
      return { ...state, value: !state };
    default:
      return state;
  }
};

export default addComponentPopupStatusReducer;
