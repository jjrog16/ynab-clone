import { addDoc, collection, getFirestore } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import "../styles/css/AddCategoryGroupPopup.css";

function AddCategoryGroupPopup(props: { currentPosition: number }) {
  const [inputState, setInputState] = useState<string>("");

  async function addNewCategoryGroupToDb() {
    // Location to place new CategoryGroup
    const categoryGroupLocation = collection(getFirestore(), "categoryGroups");
    await addDoc(categoryGroupLocation, {
      position: props.currentPosition + 1,
      title: inputState,
    });
  }

  return (
    <div className="add-category-popup-container">
      <div className="new-category-group">
        <form>
          <input
            type="text"
            id="et-add-new-category-group"
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
          ></input>
        </form>
      </div>
      <div className="btn-container">
        <button>Cancel</button>
        <button onClick={() => addNewCategoryGroupToDb()}>OK</button>
      </div>
    </div>
  );
}

export default AddCategoryGroupPopup;
