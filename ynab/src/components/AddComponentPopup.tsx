import { addDoc, CollectionReference } from "@firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disableAddComponentPopup } from "../actions";
import "../styles/css/AddComponentPopup.css";

interface Props {
  componentObjectAdded: any;
  addLocationForDb: CollectionReference;
  componentType: string;
  rerender: any;
  setAddComponentPopupStatus: any;
}

function AddComponentPopup(props: Props) {
  const dispatch = useDispatch();

  const [inputState, setInputState] = useState<string>("");

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const addComponentToDb = useCallback(
    async (location: CollectionReference) => {
      console.log(props.componentType);
      console.log(`isSending: ${isSending}`);

      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // Change the title of the component based on the input
      props.componentObjectAdded["title"] = inputState;

      // Add the doc based on location passed and the object type passed in props
      await addDoc(location, props.componentObjectAdded);

      // once the request is sent, update state again
      // only update if we are still mounted
      if (isMounted.current) setIsSending(false);

      // Load from Firebase to cause a rerender since a new addition has been added
      props.rerender();

      // Dismiss the popup
      props.setAddComponentPopupStatus(false);
    },
    [isSending, inputState]
  );

  return (
    <div className="add-component-popup-container">
      <div className="new-component">
        <form>
          <input
            type="text"
            id="et-add-new-component"
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
          ></input>
        </form>
      </div>
      <div className="btn-container">
        <button onClick={() => props.setAddComponentPopupStatus(false)}>
          Cancel
        </button>
        <button onClick={() => addComponentToDb(props.addLocationForDb)}>
          OK
        </button>
      </div>
    </div>
  );
}

export default AddComponentPopup;
