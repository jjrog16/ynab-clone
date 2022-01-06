// Controls visibility for AddComponent
const addComponentPopupStatusReducer = (
  state = { value: false },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "addComponentPopupStatus/disable":
      return { value: false };
    case "addComponentPopupStatus/enable":
      return { value: true };
    case "addComponentPopupStatus/toggle":
      return { value: !state };
    default:
      return state;
  }
};

export default addComponentPopupStatusReducer;
