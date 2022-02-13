import {
  addDoc,
  arrayUnion,
  CollectionReference,
  DocumentReference,
  updateDoc,
} from "@firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/css/AddComponentPopup.css";

interface Props {
  componentObjectAdded: any;
  addLocationForDbAsCollectionReference: CollectionReference | null;
  addLocationForDbAsDocumentReference: DocumentReference | null;
  componentType: string;
  setAddComponentPopupStatus: any;
  setIsValidToLoadCategories: any;
}

function AddComponentPopup(props: Props) {
  const dispatch = useDispatch();

  const [inputState, setInputState] = useState<string>("");

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  const [isOkPressed, setIsOkPressed] = useState(false);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    // Location changes based on if we need a collection reference or document reference
    const location =
      props.componentType === "categoryGroups"
        ? props.addLocationForDbAsCollectionReference
        : props.addLocationForDbAsDocumentReference;

    if (isOkPressed) {
      addComponentToDb(location);
    }
    return () => {
      // Dismiss the popup
      props.setAddComponentPopupStatus(false);
    };
  }, [isOkPressed]);

  const addComponentToDb = useCallback(
    async (location: any) => {
      // don't send again while we are sending
      //if (isSending) return;

      // update state
      //setIsSending(true);

      switch (props.componentType) {
        case "categoryGroups":
          // Change the title of the component based on input if the input has changed
          if (props.componentObjectAdded["title"] !== inputState) {
            // Change the title of the component based on the input
            props.componentObjectAdded["title"] = inputState;

            // Add the doc based on location passed and the object type passed in props
            await addDoc(location, props.componentObjectAdded);

            // once the request is sent, update state again
            // only update if we are still mounted
            //if (isMounted.current) setIsSending(false);

            // Set reload of CategoryGroups to true
            props.setIsValidToLoadCategories(true);

            // Dismiss the popup
            props.setAddComponentPopupStatus(false);
          }

          break;
        case "categories":
          // Change the title of the component based on input if the input has changed
          if (props.componentObjectAdded["title"] !== inputState) {
            // Update the name to the new name
            props.componentObjectAdded["title"] = inputState;

            // Add to the array in the document
            await updateDoc(location, {
              categories: arrayUnion(props.componentObjectAdded),
            });

            // Set reload of CategoryGroups to true
            props.setIsValidToLoadCategories(true);
          }
          break;
      }
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
        <button
          onClick={() => {
            setIsOkPressed(true);
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default AddComponentPopup;
