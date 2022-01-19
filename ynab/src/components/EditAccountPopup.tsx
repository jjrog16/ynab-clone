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
  setTotalAmount,
} from "../actions";
import moneyAmountTotalReducer from "../reducers/moneyAmountTotal";
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
  const moneyTotalAmount = useSelector(
    (state: any) => state.moneyAmountTotalReducer.value
  );

  // Array of QueryDocumentSnapshot containing all bank accounts
  const bankAccounts = useSelector(
    (state: any) => state.bankAccountsReducer.value
  );

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

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

    return () => {
      isMounted.current = false;
    };
  }, [isSavePressed, isDeletePressed]);

  const saveEditedAccountToDb = useCallback(
    async (location: DocumentReference) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

      // Only perform steps if the entered account field is no longer empty
      if (editAccountNameInput !== "") {
        // If the number entered cannot be converted to a number, then pass 0
        const bankAmount = Number(editAccountWorkingBalanceInput.value)
          ? Number(editAccountWorkingBalanceInput.value)
          : 0;

        await setDoc(location, {
          amount: bankAmount,
          title: editAccountNameInput.value,
        });

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // If the input the user entered for the change is higher than account amount in Db,
        // subtract the account amount from the input amount and add that to totalAmount
        if (
          bankAccounts[props.accountIndex].data().amount <
          editAccountWorkingBalanceInput
        ) {
          dispatch(
            setTotalAmount(
              moneyTotalAmount +
                Number(editAccountWorkingBalanceInput) -
                bankAccounts[props.accountIndex].data().amount
            )
          );
        } else {
          // Otherwise, the input is less than what we have in the db,
          // so we are going to subtract that from the totalAmount
          dispatch(
            setTotalAmount(
              moneyTotalAmount -
                (bankAccounts[props.accountIndex].data().amount -
                  Number(editAccountWorkingBalanceInput))
            )
          );
        }

        // Load from Firebase to cause a rerender since there is a change
        props.setIsValidToLoadAccounts(true);

        // Remove the popup window
        props.setEditAccountPopupStatus(false);
      }
    },
    [isSending, editAccountNameInput, editAccountWorkingBalanceInput]
  );

  const saveNewAccountToDb = useCallback(
    async (location: CollectionReference) => {
      // don't send again while we are sending
      if (isSending) return;

      // update state
      setIsSending(true);

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

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // Load from Firebase to cause a rerender since there is a change
        props.setIsValidToLoadAccounts(true);

        // Remove the popup window
        props.setEditAccountPopupStatus(false);
      }
    },
    [isSending, editAccountNameInput, editAccountWorkingBalanceInput]
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
        doc(
          collection(getFirestore(), "accounts"),
          bankAccounts[props.accountIndex].id
        )
      );
      // once the request is sent, update state again
      // only update if we are still mounted
      if (isMounted.current) setIsSending(false);

      // Remove money from the total balance
      dispatch(
        setTotalAmount(
          moneyTotalAmount - bankAccounts[props.accountIndex].data().amount
        )
      );

      // Load from Firebase to cause a rerender since there is a change
      props.setIsValidToLoadAccounts(true);
      // Remove the popup window
      props.setEditAccountPopupStatus(false);
    }
  }, [isSending]);

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
