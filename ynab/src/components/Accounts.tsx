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
  enableEditAccountPopup,
  setBankAccounts,
  setEditAccountNameInput,
  setEditAccountWorkingBalanceInput,
  setTotalAmount,
} from "../actions";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

function Accounts(props: Props) {
  // Hook to access Redux functions
  const dispatch = useDispatch();

  // Collection of all Bank accounts
  const bankAccounts: { value: QueryDocumentSnapshot[] } = useSelector(
    (state: any) => state.bankAccountsReducer
  );

  // Total amount of money of all bank accounts
  const moneyAmountTotal: number = useSelector(
    (state: any) => state.moneyAmountTotalReducer
  );

  const editAccountPopupStatus = useSelector(
    (state: any) => state.editAccountPopupStatusReducer
  );

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Query to get all accounts in Firebase
  const accountQuery: Query = query(collection(getFirestore(), "accounts"));

  const loadAccounts = useCallback(
    async (accountQuery) => {
      try {
        // don't send again while we are sending
        if (isSending) return;

        // update state
        setIsSending(true);

        // Set total amount to start at 0 on rerender
        dispatch(setTotalAmount(0));

        // Asynchronous load of all accounts based off query
        const accountsAsQuerySnapshot: QuerySnapshot = await getDocs(
          accountQuery
        );

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          accountsAsQuerySnapshot.docs;

        dispatch(setBankAccounts(arrayOfQueryDocumentSnapshots));
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    },
    [isSending]
  );

  useEffect(() => {
    loadAccounts(accountQuery);
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Amount of money with dollar sign and decimal
  let totalAmountFixed = `$${Number(moneyAmountTotal).toFixed(2)}`;

  /**
   * Set of operations to perform once add account button is clicked
   */
  function handleAddAccount() {
    // Set popup to true
    dispatch(enableEditAccountPopup());

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
          <h5 className="budget-total-amount">{totalAmountFixed}</h5>
        </div>
        <div className="account-wrapper">
          {editAccountPopupStatus ? (
            <EditAccountPopup
              coodinates={{
                x: 300,
                y: 200,
              }}
              rerenderLoadAccounts={() => loadAccounts(accountQuery)}
            />
          ) : null}
          <ul className="account-items">
            {bankAccounts.value.map((account: any) => {
              return <AccountItem key={account.id} account={account} />;
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
