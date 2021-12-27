import { CollectionReference } from "@firebase/firestore";
import React, { useState } from "react";
import "../styles/css/EditComponentPopup.css";
interface Props {}

function EditComponentPopup(props: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [inputState, setInputState] = useState<string>("");

  async function editComponentInDb(location: CollectionReference) {}

  return (
    <div className="edit-component-popup-container">
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
      <div className="btn-container">
        <button onClick={() => console.log("Cancel")}>Cancel</button>
        <button onClick={() => console.log("OK")}>OK</button>
      </div>
    </div>
  );
}
export default EditComponentPopup;
