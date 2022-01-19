import "../src/styles/css/App.css";
import { BrowserRouter, Routes, Route, Params } from "react-router-dom";
import SideBar from "./components/SideBar";
import Budget from "./components/pages/Budget";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "@firebase/app";
import { getFirebaseConfig } from "./firebase-config";

import Transactions from "./components/pages/Transactions";
import { useSelector, useDispatch } from "react-redux";
import { QueryDocumentSnapshot } from "@firebase/firestore";

function App() {
  const dispatch = useDispatch();
  const allCategories = useSelector(
    (state: any) => state.allCategoriesReducer.value
  );

  // Array of QueryDocumentSnapshot containing all bank accounts
  const bankAccounts = useSelector(
    (state: any) => state.bankAccountsReducer.value
  );

  // Holds the total amount of all categoryGroups after the array reduce
  const [runningCategoryGroupAmount, setRunningCategoryGroupAmount] = useState<{
    available: number;
  }>({ available: 0 });

  useEffect(() => {
    setRunningCategoryGroupAmount(
      allCategories.reduce((prev: any, curr: any) => {
        return { available: prev.available + curr.available };
      })
    );
    return () => {};
  }, [allCategories]);

  const [runningAccountAmount, setRunningAccountAmount] = useState();

  // TODO: Fix bank account reduce
  // useEffect(() => {
  //   if (bankAccounts.length > 0) {
  //     setRunningAccountAmount(
  //       bankAccounts.reduce((prev: any, curr: any) => {
  //         return prev.data().amount + curr.data().amount;
  //       })
  //     );
  //   }
  // }, [bankAccounts]);

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar />
        <Routes>
          <Route
            path="/"
            element={
              <Budget
                runningCategoryGroupAmount={
                  runningCategoryGroupAmount.available
                }
              />
            }
          />
          <Route
            path="/AccountTransactions/:name/:id"
            element={<Transactions />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export default App;
