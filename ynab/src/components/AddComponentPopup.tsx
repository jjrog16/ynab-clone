import {
  addDoc,
  collection,
  CollectionReference,
  getFirestore,
} from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import "../styles/css/AddComponentPopup.css";

function AddComponentPopup(props: {
  componentObjectAdded: any;
  addLocationForDb: CollectionReference;
  rerender: any;
  setPopupStatus: any;
}) {
  const [inputState, setInputState] = useState<string>("");

  async function addComponentToDb(location: CollectionReference) {
    // Change the title of the component based on the input
    props.componentObjectAdded["title"] = inputState;

    // Add the doc based on location passed and the object type passed in props
    await addDoc(location, props.componentObjectAdded);

    // Load from Firebase to cause a rerender since a new addition has been added
    props.rerender();

    // Dismiss the popup
    props.setPopupStatus(false);
  }

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
        <button onClick={() => props.setPopupStatus(false)}>Cancel</button>
        <button onClick={() => addComponentToDb(props.addLocationForDb)}>
          OK
        </button>
      </div>
    </div>
  );
}

export default AddComponentPopup;
