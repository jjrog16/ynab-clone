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
  setTotalAmount,
} from "../actions";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

function Accounts(props: Props) {
  // Hook to access Redux functions
  const dispatch = useDispatch();

  // Collection of all Bank accounts
  const bankAccounts = useSelector((state: any) => state.bankAccountsReducer);

  // Total amount of money of all bank accounts
  const moneyAmountTotal = useSelector(
    (state: any) => state.moneyAmountTotalReducer
  );

  // Sets status for editAccount popup, which appears on edit and on new accounts
  const [editAccountPopupStatus, setEditAccountPopupStatus] = useState(false);

  // Controls if we should rerender the accounts
  const [isValidToLoadAccounts, setIsValidToLoadAccounts] = useState(true);

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Keep track of the index for accounts in order to send to EditAccountPopup
  const [accountIndex, setAccountIndex] = useState(-1);

  // Query to get all accounts in Firebase
  const accountQuery: Query = query(collection(getFirestore(), "accounts"));

  useEffect(() => {
    if (isValidToLoadAccounts) {
      loadAccounts(accountQuery);
    }
    return () => {
      isMounted.current = false;
    };
  }, [isValidToLoadAccounts]);

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

  // Amount of money with dollar sign and decimal
  let totalAmountFixed = `$${Number(moneyAmountTotal.value).toFixed(2)}`;

  /**
   * Set of operations to perform once add account button is clicked
   */
  function handleAddAccount() {
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
          <h5 className="budget-total-amount">{totalAmountFixed}</h5>
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
              isValidToLoadAccounts={isValidToLoadAccounts}
              setIsValidToLoadAccounts={setIsValidToLoadAccounts}
            />
          ) : null}
          <ul className="account-items">
            {bankAccounts.value.map((account: any, idx: number) => {
              return (
                <AccountItem
                  key={account.id}
                  account={account}
                  index={idx}
                  setAccountIndex={setAccountIndex}
                  setEditAccountPopupStatus={setEditAccountPopupStatus}
                  isValidToLoadAccounts={isValidToLoadAccounts}
                  setIsValidToLoadAccounts={setIsValidToLoadAccounts}
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
