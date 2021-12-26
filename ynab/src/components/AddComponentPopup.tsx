import { addDoc, collection, getFirestore } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import "../styles/css/AddComponentPopup.css";

function AddComponentPopup(props: {
  currentPosition: number;
  rerender: any;
  setPopupStatus: any;
}) {
  const [inputState, setInputState] = useState<string>("");

  async function addNewCategoryGroupToDb() {
    // Location to place new CategoryGroup
    const categoryGroupLocation = collection(getFirestore(), "categoryGroups");
    await addDoc(categoryGroupLocation, {
      position: props.currentPosition + 1,
      title: inputState,
    });

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
        <button onClick={() => addNewCategoryGroupToDb()}>OK</button>
      </div>
    </div>
  );
}

export default AddComponentPopup;
