import {
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
  setDoc,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/css/EditComponentPopup.css";

interface Props {
  coordinates: { x: number; y: number };
  component: QueryDocumentSnapshot;
  componentObjectAdded: any;
  componentType: string;
  editLocationForDb: DocumentReference;
  rerender: any;
  popupStatus: boolean;
  setPopupStatus: any;
}

function EditComponentPopup(props: Props) {
  // Set up the input state to be the passed in title
  const [inputState, setInputState] = useState<string>(
    props.componentObjectAdded.title
  );

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

      // Change the title of the component based on input if the input has changed
      if (props.componentObjectAdded["title"] !== inputState) {
        props.componentObjectAdded["title"] = inputState;

        // Set the Docu based on the location passed and the object type passed in props
        await setDoc(location, props.componentObjectAdded);

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // Load from Firebase to cause a rerender since there is a change
        props.rerender();
      }

      // Dismiss the popup
      removePopup();
    },
    [isSending, inputState]
  );

  const deletePassedComponentInDb = useCallback(
    async (location: DocumentReference) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // eslint-disable-next-line no-restricted-globals
      if (confirm("Bruh like are you sure?")) {
        console.log("Deleted");
        console.log(`Group ID: ${props.component.data().groupId}`);
      } else {
        console.log("Cancelled");
      }
    },
    [isSending]
  );

  // Sets popup status to false to remove popup from view.
  function removePopup() {
    props.setPopupStatus(false);
  }

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
          <button onClick={() => removePopup()}>Cancel</button>
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
