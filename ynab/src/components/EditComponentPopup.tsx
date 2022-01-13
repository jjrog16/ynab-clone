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
import { setIsValidToLoad, setTotalCategoryGroupAmount } from "../actions";
import categoryGroupAmountTotalReducer from "../reducers/categoryGroupAmountTotal";
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

  const categoryGroupAmountTotal = useSelector(
    (state: any) => state.categoryGroupAmountTotalReducer.value
  );

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // State of input field
  const [inputState, setInputState] = useState<string>(
    props.componentObjectTemplate.title
  );

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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

            // Set reload to true
            dispatch(setIsValidToLoad(true));

            // Load from Firebase to cause a rerender since there is a change
            props.rerender();
          }

          // Dismiss the popup
          props.setEditComponentPopupStatus(false);
          break;
        case "categories":
          // Change the title of the component based on input if the input has changed
          if (props.componentObjectTemplate["title"] !== inputState) {
            // Remove the old entry in array
            await updateDoc(location, {
              categories: arrayRemove(props.componentObjectTemplate),
            });

            // Update the name to the new name
            props.componentObjectTemplate["title"] = inputState;

            // Add to the array in the document
            await updateDoc(location, {
              categories: arrayUnion(props.componentObjectTemplate),
            });

            // once the request is sent, update state again
            // only update if we are still mounted
            if (isMounted.current) setIsSending(false);

            // Set reload to true
            dispatch(setIsValidToLoad(true));

            // Load from Firebase to cause a rerender since there is a change
            //props.rerender();
            window.location.reload();
          }
      }
    },
    [isSending, inputState, categoryGroupAmountTotal]
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

          // Remove money in category from total Category Group amount to update RTA
          console.log(
            props.component.available,
            typeof props.component.available
          );
          dispatch(
            setTotalCategoryGroupAmount(
              categoryGroupAmountTotal - Number(props.component.available)
            )
          );

          dispatch(setIsValidToLoad(true));

          // Load from Firebase to cause a rerender since there is a change
          //props.rerender();
          window.location.reload();
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

        dispatch(setIsValidToLoad(true));

        // Load from Firebase to cause a rerender since there is a change
        props.rerender();

        // Dismiss the popup
        props.setEditComponentPopupStatus(false);
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
          <button
            onClick={() => deletePassedComponentInDb(props.editLocationForDb)}
          >
            Delete
          </button>
        </div>
        <div className="right-side-buttons">
          <button onClick={() => props.setEditComponentPopupStatus(false)}>
            Cancel
          </button>
          <button
            onClick={() => editPassedComponentInDb(props.editLocationForDb)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditComponentPopup;
