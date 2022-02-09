import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditAccountNameInput,
  setEditAccountWorkingBalanceInput,
} from "../actions";
import "../styles/css/EditAccountPopup.css";
interface Props {
  coodinates: { x: number; y: number };
  editAccountPopupStatus: boolean;
  setEditAccountPopupStatus: any;
  isValidToLoadAccounts: boolean;
  setIsValidToLoadAccounts: any;
  accountIndex: number;
}

function EditAccountPopup(props: Props) {
  const dispatch = useDispatch();

  const editAccountNameInput = useSelector(
    (state: any) => state.editAccountNameInputReducer.value
  );
  const editAccountWorkingBalanceInput = useSelector(
    (state: any) => state.editAccountWorkingBalanceInputReducer.value
  );

  // Array of QueryDocumentSnapshot containing all bank accounts
  const bankAccounts = useSelector(
    (state: any) => state.bankAccountsReducer.value
  );

  // The location for where accounts are stored
  const accountDbLocation = collection(getFirestore(), "accounts");

  const [isSavePressed, setIsSavePressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    if (isSavePressed) {
      // If there is a valid id and the value being passed is not undefined, then
      // we know we can edit the existing account

      if (props.accountIndex !== -1) {
        saveEditedAccountToDb(
          doc(accountDbLocation, bankAccounts[props.accountIndex].id)
        );
      } else {
        // Add as a new doc
        saveNewAccountToDb(accountDbLocation);
      }
    }

    if (isDeletePressed) {
      deleteAccountInDb();
    }

    return () => {};
  }, [isSavePressed, isDeletePressed]);

  const saveEditedAccountToDb = useCallback(
    async (location: DocumentReference) => {
      // Only perform steps if the entered account field is no longer empty
      if (editAccountNameInput !== "") {
        // If the number entered cannot be converted to a number, then pass 0
        const bankAmount = Number(editAccountWorkingBalanceInput)
          ? Number(editAccountWorkingBalanceInput)
          : 0;

        await setDoc(location, {
          amount: bankAmount,
          title: editAccountNameInput,
        });

        props.setIsValidToLoadAccounts(true);

        // Remove the popup window
        props.setEditAccountPopupStatus(false);
      }
    },
    [editAccountNameInput, editAccountWorkingBalanceInput]
  );

  const saveNewAccountToDb = useCallback(
    async (location: CollectionReference) => {
      // Only perform steps if the entered account field is no longer empty
      if (editAccountNameInput !== "") {
        // If the number entered cannot be converted to a number, then pass 0
        const bankAmount = Number(editAccountWorkingBalanceInput)
          ? Number(editAccountWorkingBalanceInput)
          : 0;

        await addDoc(location, {
          amount: bankAmount,
          title: editAccountNameInput,
        });

        props.setIsValidToLoadAccounts(true);

        // Remove the popup window
        props.setEditAccountPopupStatus(false);
      }
    },
    [editAccountNameInput, editAccountWorkingBalanceInput]
  );

  const deleteAccountInDb = useCallback(async () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete?")) {
      // Delete the doc for the passed account
      deleteDoc(
        doc(
          collection(getFirestore(), "accounts"),
          bankAccounts[props.accountIndex].id
        )
      );

      props.setIsValidToLoadAccounts(true);

      // Remove the popup window
      props.setEditAccountPopupStatus(false);
    } else {
      setIsDeletePressed(false);
    }
  }, []);

  return (
    <div
      className="edit-account-popup-container"
      style={{ top: props.coodinates.y, left: props.coodinates.x }}
    >
      <div className="edit-account-name-section">
        <div className="edit-account-name-title">Account Name</div>
        <div className="edit-account-name-input-field">
          <form>
            <input
              type="text"
              id={"et-account-name"}
              value={editAccountNameInput}
              onChange={(e) =>
                dispatch(setEditAccountNameInput(e.target.value))
              }
            ></input>
          </form>
        </div>
      </div>
      <div className="working-balance-section">
        <div className="working-balance-title">Working Balance</div>
        <div className="working-balance-input-field">
          <form>
            <input
              type="number"
              id="et-working-balance"
              value={editAccountWorkingBalanceInput}
              onChange={(e) =>
                dispatch(setEditAccountWorkingBalanceInput(e.target.value))
              }
            ></input>
          </form>
        </div>
      </div>
      <div className="edit-account-buttons-container">
        <div className="edit-account-buttons-left-side">
          <div className="edit-account-delete-button">
            <button className="delete" onClick={() => setIsDeletePressed(true)}>
              Delete
            </button>
          </div>
        </div>
        <div className="edit-account-buttons-right-side">
          <div className="edit-account-buttons-cancel-button">
            <button
              className="cancel"
              onClick={() => props.setEditAccountPopupStatus(false)}
            >
              Cancel
            </button>
          </div>
          <div className="edit-account-buttons-save-button">
            <button className="save" onClick={() => setIsSavePressed(true)}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAccountPopup;
