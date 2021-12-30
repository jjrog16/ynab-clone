import React from "react";
import "../styles/css/EditAccountPopup.css";
interface Props {
  coodinates: { x: number; y: number };
  componentObjectTemplate: any;
}
function EditAccountPopup(props: Props) {
  return (
    <div className="edit-account-popup-container">
      <div className="edit-account-name-section">
        <div className="edit-account-name-title">Account Name</div>
        <div className="edit-account-name-input-field">
          <form>
            <input type="text"></input>
          </form>
        </div>
      </div>
      <div className="working-balance-section">
        <div className="working-balance-title">Working Balance</div>
        <div className="working-balance-input-field">
          <form>
            <input type="text"></input>
          </form>
        </div>
      </div>
      <div className="edit-account-buttons-container">
        <div className="edit-account-buttons-left-side">
          <div className="edit-account-delete-button">
            <button className="delete">Delete</button>
          </div>
        </div>
        <div className="edit-account-buttons-right-side">
          <div className="edit-account-buttons-cancel-button">
            <button className="cancel">Cancel</button>
          </div>
          <div className="edit-account-buttons-save-button">
            <button className="save">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAccountPopup;
