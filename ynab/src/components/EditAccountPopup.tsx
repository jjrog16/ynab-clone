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
import "../styles/css/EditAccountPopup.css";
interface Props {
  coodinates: { x: number; y: number };
  editAccountPopupStatus: boolean;
  setEditAccountPopupStatus: any;
  editAccountNameInput: string;
  setEditAccountNameInput: any;
  editAccountWorkingBalanceInput: string;
  setEditAccountWorkingBalanceInput: any;
  accountPassed: QueryDocumentSnapshot | undefined;
  setAccountPassed: any;
  rerenderLoadAccounts: any;
  totalAmount: number;
  setTotalAmount: any;
}
function EditAccountPopup(props: Props) {
  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // The location for where accounts are stored
  const accountDbLocation = collection(getFirestore(), "accounts");

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const saveEditedAccountToDb = useCallback(
    async (location: DocumentReference) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // Only perform steps if the entered account field is no longer empty
      if (props.editAccountNameInput !== "") {
        // If the number entered cannot be converted to a number, then pass 0
        const bankAmount = Number(props.editAccountWorkingBalanceInput)
          ? Number(props.editAccountWorkingBalanceInput)
          : 0;

        await setDoc(location, {
          amount: bankAmount,
          title: props.editAccountNameInput,
        });

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // If the input the user entered for the change is higher than account amount in Db,
        // subtract the account amount from the input amount and add that to totalAmount
        if (
          props.accountPassed?.data().amount <
          props.editAccountWorkingBalanceInput
        ) {
          props.setTotalAmount(
            (prevAmount: number) =>
              prevAmount +
              (Number(props.editAccountWorkingBalanceInput) -
                props.accountPassed?.data().amount)
          );
        } else {
          // Otherwise, the input is less than what we have in the db,
          // so we are going to subtract that from the totalAmount
          props.setTotalAmount(
            (prevAmount: number) =>
              prevAmount -
              (props.accountPassed?.data().amount -
                Number(props.editAccountWorkingBalanceInput))
          );
        }

        // Load from Firebase to cause a rerender since there is a change
        props.rerenderLoadAccounts();

        // Remove the popup window
        props.setEditAccountPopupStatus(false);
      }
    },
    [
      isSending,
      props.editAccountNameInput,
      props.editAccountWorkingBalanceInput,
    ]
  );

  const saveNewAccountToDb = useCallback(
    async (location: CollectionReference) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // Only perform steps if the entered account field is no longer empty
      if (props.editAccountNameInput !== "") {
        // If the number entered cannot be converted to a number, then pass 0
        const bankAmount = Number(props.editAccountWorkingBalanceInput)
          ? Number(props.editAccountWorkingBalanceInput)
          : 0;

        await addDoc(location, {
          amount: bankAmount,
          title: props.editAccountNameInput,
        });

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // Load from Firebase to cause a rerender since there is a change
        props.rerenderLoadAccounts();

        // Remove the popup window
        props.setEditAccountPopupStatus(false);
      }
    },
    [
      isSending,
      props.editAccountNameInput,
      props.editAccountWorkingBalanceInput,
    ]
  );

  const deleteAccountInDb = useCallback(async () => {
    // don't send again while we are sending
    if (isSending) return;

    // update state
    setIsSending(true);

    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete?")) {
      // Delete the doc for the passed account
      deleteDoc(
        doc(collection(getFirestore(), "accounts"), props.accountPassed?.id)
      );
      // once the request is sent, update state again
      // only update if we are still mounted
      if (isMounted.current) setIsSending(false);

      // Remove money from the total balance
      props.setTotalAmount(
        (prevAmount: number) => prevAmount - props.accountPassed?.data().amount
      );

      // Load from Firebase to cause a rerender since there is a change
      props.rerenderLoadAccounts();

      // Remove the popup window
      props.setEditAccountPopupStatus(false);
    }
  }, [isSending]);

  /**
   * Controls whether we are editing an existing account or adding a new account
   */
  function handleSave() {
    // If there is a valid id and the value being passed is not undefined, then
    // we know we can edit the existing account
    if (props.accountPassed?.id) {
      saveEditedAccountToDb(doc(accountDbLocation, props.accountPassed?.id));
    } else {
      // Add as a new doc
      saveNewAccountToDb(accountDbLocation);
    }
  }

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
              id="et-account-name"
              value={props.editAccountNameInput}
              onChange={(e) => props.setEditAccountNameInput(e.target.value)}
            ></input>
          </form>
        </div>
      </div>
      <div className="working-balance-section">
        <div className="working-balance-title">Working Balance</div>
        <div className="working-balance-input-field">
          <form>
            <input
              type="text"
              id="et-working-balance"
              value={props.editAccountWorkingBalanceInput}
              onChange={(e) =>
                props.setEditAccountWorkingBalanceInput(e.target.value)
              }
            ></input>
          </form>
        </div>
      </div>
      <div className="edit-account-buttons-container">
        <div className="edit-account-buttons-left-side">
          <div className="edit-account-delete-button">
            <button className="delete" onClick={deleteAccountInDb}>
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
            <button className="save" onClick={() => handleSave()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAccountPopup;