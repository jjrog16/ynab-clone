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
import "../styles/css/EditComponentPopup.css";

interface Props {
  coordinates: { x: number; y: number };
  component: any;
  componentObjectTemplate: any;
  componentType: string;
  editLocationForDb: DocumentReference;
  setEditComponentPopupStatus: any;
  setIsValidToLoadCategories: any;
}

function EditComponentPopup(props: Props) {
  const dispatch = useDispatch();

  // State of input field
  const [inputState, setInputState] = useState<string>(
    props.componentObjectTemplate.title
  );

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
      switch (props.componentType) {
        case "categoryGroups":
          // Change the title of the component based on input if the input has changed
          if (props.componentObjectTemplate["title"] !== inputState) {
            props.componentObjectTemplate["title"] = inputState;

            // Set the Docu based on the location passed and the object type passed in props
            await setDoc(location, props.componentObjectTemplate);

            // Set reload of CategoryGroups to true
            props.setIsValidToLoadCategories(true);
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

            // Set reload of CategoryGroups to true to cause a rerender
            props.setIsValidToLoadCategories(true);
          }
      }
    },
    [inputState]
  );

  const deletePassedComponentInDb = useCallback(async (location: any) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete?")) {
      // Children can be deleted since they have no dependencies
      if (props.componentType === "categories") {
        // Remove the old entry in array
        await updateDoc(location, {
          categories: arrayRemove(props.componentObjectTemplate),
        });

        // Set reload of CategoryGroups to true
        props.setIsValidToLoadCategories(true);
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
      props.setIsValidToLoadCategories(true);
    } else {
      console.log("Cancelled");
    }
  }, []);

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
