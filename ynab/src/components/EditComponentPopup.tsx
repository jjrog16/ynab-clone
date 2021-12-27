import {
  CollectionReference,
  DocumentReference,
  QueryDocumentSnapshot,
  setDoc,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import "../styles/css/EditComponentPopup.css";

interface Props {
  coordinates: { x: number; y: number };
  categoryGroup: QueryDocumentSnapshot;
  componentObjectAdded: { position: number; title: string };
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
  /**
   * Use the ID for the category group passed in as a prop in order to know which
   * Firebase document to edit
   * @param location
   */
  async function editComponentInDb(location: DocumentReference) {
    // Change the title of the component based on input if the input has changed
    if (props.componentObjectAdded["title"] === inputState) {
      props.componentObjectAdded["title"] = inputState;
    }

    // Set the Docu based on the location passed and the object type passed in props
    await setDoc(location, props.componentObjectAdded);

    // Load from Firebase to cause a rerender since there is a change
    props.rerender();

    // Dismiss the popup
    removePopup();
  }

  useEffect(() => {
    if (props.popupStatus) {
      document.addEventListener("click", removePopup);
    }
    return () => {
      document.removeEventListener("click", removePopup);
    };
  }, []);

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
          <button onClick={() => console.log("Delete")}>Delete</button>
        </div>
        <div className="right-side-buttons">
          <button onClick={() => console.log("Cancel")}>Cancel</button>
          <button onClick={() => console.log("OK")}>OK</button>
        </div>
      </div>
    </div>
  );
}
export default EditComponentPopup;
