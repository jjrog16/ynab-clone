import {
  addDoc,
  arrayUnion,
  CollectionReference,
  DocumentReference,
  updateDoc,
} from "@firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllCategories,
  setIsComponentEdited,
  setIsValidToLoad,
  updateAllCategories,
} from "../actions";
import "../styles/css/AddComponentPopup.css";

interface Props {
  componentObjectAdded: any;
  addLocationForDbAsCollectionReference: CollectionReference | null;
  addLocationForDbAsDocumentReference: DocumentReference | null;
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

  const isComponentEdited = useSelector(
    (state: any) => state.isComponentEditedReducer.value
  );

  const allCategories = useSelector(
    (state: any) => state.allCategoriesReducer.value
  );

  const isValidToLoad = useSelector(
    (state: any) => state.isValidToLoadReducer.value
  );

  const [isOkPressed, setIsOkPressed] = useState(false);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    // Location changes based on if we need a collection reference or document reference
    const location =
      props.componentType === "categoryGroups"
        ? props.addLocationForDbAsCollectionReference
        : props.addLocationForDbAsDocumentReference;

    if (isOkPressed) {
      // TODO: Figure out why editComponent works but addComponent doesn't
      // rerender page
      console.log("AddComponentToDB running");
      addComponentToDb(location);
    }
    return () => {
      console.log("AddComponentPopup setting isValidToLoad to false");
      dispatch(setIsValidToLoad(false));
      // Dismiss the popup
      props.setAddComponentPopupStatus(false);
    };
  }, [isOkPressed]);

  const addComponentToDb = useCallback(
    async (location: any) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

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
            if (isMounted.current) setIsSending(false);

            // Set reload of CategoryGroups to true
            dispatch(setIsValidToLoad(true));

            dispatch(setIsComponentEdited(!isComponentEdited));

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

            const indexToFind = allCategories.findIndex(
              (element: {
                title: string;
                available: number;
                position: number;
              }) =>
                props.componentObjectAdded.title === element.title &&
                props.componentObjectAdded.available === element.available &&
                props.componentObjectAdded.position === element.position
            );

            // If  you cannot find the index, then it is not in the array. So load it
            if (indexToFind === -1) {
              dispatch(
                setAllCategories({
                  title: props.componentObjectAdded.title,
                  available: props.componentObjectAdded.available,
                  position: props.componentObjectAdded.position,
                })
              );
            } else {
              // Value exists, so just update it
              dispatch(
                updateAllCategories({
                  title: props.componentObjectAdded.title,
                  available: props.componentObjectAdded.available,
                  position: props.componentObjectAdded.position,
                  index: indexToFind,
                })
              );
            }

            console.log(
              "Status of isValid in AddComponentPopup before assignment",
              isValidToLoad
            );
            // Set reload of CategoryGroups to true
            dispatch(setIsValidToLoad(true));
            console.log(
              "Status of isValid in AddComponentPopup after assignment",
              isValidToLoad
            );
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
