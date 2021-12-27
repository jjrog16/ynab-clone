import { CollectionReference } from "@firebase/firestore";
import React, { useState } from "react";
import "../styles/css/EditComponentPopup.css";
interface Props {
  coordinates: { x: number; y: number };
}

function EditComponentPopup(props: Props) {
  const [inputState, setInputState] = useState<string>("");
  async function editComponentInDb(location: CollectionReference) {}

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
