import {
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromAllCategories,
  setIsComponentEdited,
  setIsValidToLoad,
  updateAllCategories,
} from "../actions";
import "../styles/css/EditComponentPopup.css";

interface Props {
  coordinates: { x: number; y: number };
  component: any;
  componentObjectTemplate: any;
  componentType: string;
  editLocationForDb: DocumentReference;
  rerender: any;
  setEditComponentPopupStatus: any;
}

function EditComponentPopup(props: Props) {
  const dispatch = useDispatch();

  const allCategories = useSelector(
    (state: any) => state.allCategoriesReducer.value
  );

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // State of input field
  const [inputState, setInputState] = useState<string>(
    props.componentObjectTemplate.title
  );

  const isComponentEdited = useSelector(
    (state: any) => state.isComponentEditedReducer.value
  );

  const isValidToLoad = useSelector(
    (state: any) => state.isValidToLoadReducer.value
  );

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Monitor States for button press
  const [isOkPressed, setOkPressed] = useState(false);
  const [isDeletePressed, setDeletePressed] = useState(false);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    if (isOkPressed) {
      console.log("editPassedComponentInDb running");
      editPassedComponentInDb(props.editLocationForDb);
    }

    if (isDeletePressed) {
      console.log("deletePassedComponentInDb running");
      deletePassedComponentInDb(props.editLocationForDb);
    }
    return () => {
      console.log("EditComponentPopup setting isValidToLoad to false");
      dispatch(setIsValidToLoad(false));
      // Hide the edit component popup
      props.setEditComponentPopupStatus(false);
    };
  }, [isOkPressed, isDeletePressed]);

  /**
   * Use the ID for the category group passed in as a prop in order to know which
   * Firebase document to edit
   * @param location
   */
  const editPassedComponentInDb = useCallback(
    async (location: DocumentReference) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      switch (props.componentType) {
        case "categoryGroups":
          // Change the title of the component based on input if the input has changed
          if (props.componentObjectTemplate["title"] !== inputState) {
            props.componentObjectTemplate["title"] = inputState;

            // Set the Docu based on the location passed and the object type passed in props
            await setDoc(location, props.componentObjectTemplate);

            // once the request is sent, update state again
            // only update if we are still mounted
            if (isMounted.current) setIsSending(false);

            // Set reload of CategoryGroups to true
            dispatch(setIsValidToLoad(true));
          }

          // Dismiss the popup
          props.setEditComponentPopupStatus(false);
          break;
        case "categories":
          // Change the title of the component based on input if the input has changed
          if (props.componentObjectTemplate["title"] !== inputState) {
            // Find the category in the categories array before sending the request

            console.log(
              `Category before awaits: ${props.componentObjectTemplate.title}`
            );

            const indexToFind = allCategories.findIndex(
              (element: {
                title: string;
                available: number;
                position: number;
              }) =>
                props.componentObjectTemplate.title === element.title &&
                props.componentObjectTemplate.available === element.available &&
                props.componentObjectTemplate.position === element.position
            );

            // Remove the old entry in array
            await updateDoc(location, {
              categories: arrayRemove(props.componentObjectTemplate),
            });

            // Update the name to the new name
            props.componentObjectTemplate["title"] = inputState;

            // Update allCategories before sending request
            dispatch(
              updateAllCategories({
                title: props.componentObjectTemplate.title,
                available: props.componentObjectTemplate.available,
                position: props.componentObjectTemplate.position,
                index: indexToFind,
              })
            );

            // Add to the array in the document
            await updateDoc(location, {
              categories: arrayUnion(props.componentObjectTemplate),
            });

            // Set reload of CategoryGroups to true to cause a rerender
            dispatch(setIsValidToLoad(true));
          }
      }
    },
    [isSending, inputState, allCategories]
  );

  const deletePassedComponentInDb = useCallback(
    async (location: any) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure you want to delete?")) {
        // Children can be deleted since they have no dependencies
        if (props.componentType === "categories") {
          // Remove the old entry in array
          await updateDoc(location, {
            categories: arrayRemove(props.componentObjectTemplate),
          });

          // once the request is sent, update state again
          // only update if we are still mounted
          if (isMounted.current) setIsSending(false);

          // Find the category in the categories array and remove
          const indexToFind = allCategories.findIndex(
            (element: { title: string; available: number }) =>
              props.componentObjectTemplate.title === element.title
          );

          // Remove from the total category group array
          dispatch(
            removeFromAllCategories({
              title: props.componentObjectTemplate.title,
              available: props.componentObjectTemplate.available,
              index: indexToFind,
            })
          );

          // Set reload of CategoryGroups to true
          dispatch(setIsValidToLoad(true));
        }

        // Parent groups need to have all of their children deleted
        if (props.componentType === "categoryGroups") {
          // Delete the parent
          deleteDoc(
            doc(
              collection(getFirestore(), props.componentType),
              props.component.id
            )
          );
        }
        // Set reload of CategoryGroups to true
        dispatch(setIsValidToLoad(true));
      } else {
        console.log("Cancelled");
      }
    },
    [isSending]
  );

  return (
    <div
      className="edit-component-popup-container"
      style={{ top: props.coordinates.y, left: props.coordinates.x }}
    >
      <div className="new-component">
        <form>
          <input
            type="text"
            id="et-edit-new-component"
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
          ></input>
        </form>
      </div>
      <div className="edit-components-btn-container">
        <div className="left-side-buttons">
          <button onClick={() => setDeletePressed(true)}>Delete</button>
        </div>
        <div className="right-side-buttons">
          <button onClick={() => props.setEditComponentPopupStatus(false)}>
            Cancel
          </button>
          <button onClick={() => setOkPressed(true)}>OK</button>
        </div>
      </div>
    </div>
  );
}
export default EditComponentPopup;
