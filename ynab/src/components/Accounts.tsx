import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/css/Accounts.css";
import AccountItem from "./AccountItem";
import EditAccountPopup from "./EditAccountPopup";
import {
  setBankAccounts,
  setEditAccountNameInput,
  setEditAccountWorkingBalanceInput,
} from "../actions";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  runningAccountAmount: number;
  isValidToLoadAccounts: boolean;
  setIsValidToLoadAccounts: any;
}

function Accounts(props: Props) {
  // Hook to access Redux functions
  const dispatch = useDispatch();

  // Collection of all Bank accounts
  const bankAccounts = useSelector(
    (state: any) => state.bankAccountsReducer.value
  );

  // Sets status for editAccount popup, which appears on edit and on new accounts
  const [editAccountPopupStatus, setEditAccountPopupStatus] = useState(false);

  // Keep track of the index for accounts in order to send to EditAccountPopup
  const [accountIndex, setAccountIndex] = useState(-1);

  // Query to get all accounts in Firebase
  const accountQuery: Query = query(collection(getFirestore(), "accounts"));

  useEffect(() => {
    if (props.isValidToLoadAccounts) {
      loadAccounts(accountQuery);
      props.setIsValidToLoadAccounts(false);
    }
    return () => {};
  }, [props.isValidToLoadAccounts]);

  const loadAccounts = useCallback(async (accountQuery) => {
    try {
      // Asynchronous load of all accounts based off query
      const accountsAsQuerySnapshot: QuerySnapshot = await getDocs(
        accountQuery
      );

      // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
      const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
        accountsAsQuerySnapshot.docs;

      dispatch(setBankAccounts(arrayOfQueryDocumentSnapshots));
    } catch (e) {
      console.log("An error occurred when trying to load your accounts");
      console.log(`Error: ${e}`);
    }
  }, []);

  /**
   * Set of operations to perform once add account button is clicked
   */
  function handleAddAccount() {
    // Set the accountIndex to -1 since we are not editing a current account
    setAccountIndex(-1);

    // Toggle showing add account
    setEditAccountPopupStatus(!editAccountPopupStatus);

    // Set account name input to be empty
    dispatch(setEditAccountNameInput(""));

    // Set working balance input to empty
    dispatch(setEditAccountWorkingBalanceInput(""));
  }
  return (
    <>
      <div className="all-accounts">
        <div className="budget-header">
          <h5 className="budget-title">BUDGET</h5>
          {Number(props.runningAccountAmount) && (
            <h5 className="budget-total-amount">{`$${Number(
              props.runningAccountAmount
            ).toFixed(2)}`}</h5>
          )}
        </div>
        <div className="account-wrapper">
          {editAccountPopupStatus ? (
            <EditAccountPopup
              coodinates={{
                x: 300,
                y: 200,
              }}
              accountIndex={accountIndex}
              editAccountPopupStatus={editAccountPopupStatus}
              setEditAccountPopupStatus={setEditAccountPopupStatus}
              isValidToLoadAccounts={props.isValidToLoadAccounts}
              setIsValidToLoadAccounts={props.setIsValidToLoadAccounts}
            />
          ) : null}
          <ul className="account-items">
            {bankAccounts.map((account: any, idx: number) => {
              return (
                <AccountItem
                  key={account.id}
                  account={account}
                  index={idx}
                  setAccountIndex={setAccountIndex}
                  editAccountPopupStatus={editAccountPopupStatus}
                  setEditAccountPopupStatus={setEditAccountPopupStatus}
                  isValidToLoadAccounts={props.isValidToLoadAccounts}
                  setIsValidToLoadAccounts={props.setIsValidToLoadAccounts}
                />
              );
            })}
          </ul>
        </div>
      </div>
      <div className="button-add-account-container">
        <button className="btn-add-account" onClick={handleAddAccount}>
          Add account
        </button>
      </div>
    </>
  );
}

export default Accounts;
