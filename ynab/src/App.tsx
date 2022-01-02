import "../src/styles/css/App.css";
import { BrowserRouter, Routes, Route, Params } from "react-router-dom";
import SideBar from "./components/SideBar";
import Budget from "./components/pages/Budget";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "@firebase/app";
import { getFirebaseConfig } from "./firebase-config";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  QuerySnapshot,
  QueryDocumentSnapshot,
  Query,
  where,
} from "@firebase/firestore";
import Transactions from "./components/pages/Transactions";

function App() {
  const [allAccounts, setAllAccounts] = useState<QueryDocumentSnapshot[]>();

  // Array of all transactions based on the account
  const [allTransactions, setAllTransactions] =
    useState<QueryDocumentSnapshot[]>();

  // Keep track of the total amount of money available from all bank accounts
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Keep track of the total amount of money from a Category Group
  const [totalCategoryGroupAmount, setTotalCategoryGroupAmount] =
    useState<number>(0);

  // Keep track of the ready to assign amount and recalculate when sections are deleted
  const [readyToAssignTotal, setReadyToAssignTotal] = useState<number>(0);

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
        setTotalAmount(0);

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
        setAllAccounts(arrayOfQueryDocumentSnapshots);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    },
    [isSending]
  );

  const loadTransactions = useCallback(
    async (query: Query) => {
      try {
        console.log(`Load Transaction called.`);
        // don't send again while we are sending
        if (isSending) return;

        // update state
        setIsSending(true);

        // Asynchronous load of all transactions
        const transactionsAsQuerySnapshot: QuerySnapshot = await getDocs(query);

        // Array of QueryDocumentSnapshots that allows for mapping
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          transactionsAsQuerySnapshot.docs;

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        setAllTransactions(arrayOfQueryDocumentSnapshots);
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

  // Handle the popups for Editing Accounts and Adding Accounts
  // Controls if popup should be visible
  const [editAccountPopupStatus, setEditAccountPopupStatus] =
    useState<boolean>(false);

  // The default state for the account name input field inside the EditAccountPopup component
  const [editAccountNameInput, setEditAccountNameInput] = useState("");

  // The default state for the working balance input field inside the EditAccountPopup component
  const [editAccountWorkingBalanceInput, setEditAccountWorkingBalanceInput] =
    useState("");

  // The account id for the account being edited or deleted
  const [accountPassed, setAccountPassed] = useState<
    QueryDocumentSnapshot | undefined
  >();

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar
          accounts={allAccounts}
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
          editAccountPopupStatus={editAccountPopupStatus}
          setEditAccountPopupStatus={setEditAccountPopupStatus}
          editAccountNameInput={editAccountNameInput}
          setEditAccountNameInput={setEditAccountNameInput}
          editAccountWorkingBalanceInput={editAccountWorkingBalanceInput}
          setEditAccountWorkingBalanceInput={setEditAccountWorkingBalanceInput}
          setAccountPassed={setAccountPassed}
          loadTransactions={loadTransactions}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Budget
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
                totalCategoryGroupAmount={totalCategoryGroupAmount}
                setTotalCategoryGroupAmount={setTotalCategoryGroupAmount}
                readyToAssignTotal={readyToAssignTotal}
                setReadyToAssignTotal={setReadyToAssignTotal}
                editAccountPopupStatus={editAccountPopupStatus}
                setEditAccountPopupStatus={setEditAccountPopupStatus}
                editAccountNameInput={editAccountNameInput}
                setEditAccountNameInput={setEditAccountNameInput}
                editAccountWorkingBalanceInput={editAccountWorkingBalanceInput}
                setEditAccountWorkingBalanceInput={
                  setEditAccountWorkingBalanceInput
                }
                accountPassed={accountPassed}
                setAccountPassed={setAccountPassed}
                rerenderLoadAccounts={() => loadAccounts(accountQuery)}
              />
            }
          />
          <Route
            path="/AccountTransactions/:name/:id"
            element={
              <Transactions
                allTransactions={allTransactions}
                setAllTransactions={setAllTransactions}
                loadTransactions={loadTransactions}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export default App;
