import "../src/styles/css/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import Budget from "./components/pages/Budget";
import { useState, useEffect } from "react";
import { initializeApp } from "@firebase/app";
import { getFirebaseConfig } from "./firebase-config";

import Transactions from "./components/pages/Transactions";
import { useSelector } from "react-redux";
import { QueryDocumentSnapshot, QuerySnapshot } from "@firebase/firestore";

function App() {
  // Collection of all Category groups, which also contain Categories
  const categoryGroups = useSelector(
    (state: any) => state.categoryGroupsReducer.value
  );

  // Array of QueryDocumentSnapshot containing all bank accounts
  const bankAccounts = useSelector(
    (state: any) => state.bankAccountsReducer.value
  );

  // Holds the total amount of all categoryGroups after the array reduce
  const [runningCategoryGroupAmount, setRunningCategoryGroupAmount] = useState<{
    available: number;
  }>({ available: 0 });

  // Controls if we should rerender
  const [isValidToLoadAccounts, setIsValidToLoadAccounts] = useState(true);
  const [isValidToLoadCategories, setIsValidToLoadCategories] = useState(true);
  const [isValidToLoadTransactions, setIsValidToLoadTransactions] =
    useState(true);

  useEffect(() => {
    /**
     * Calculate the total amount of all categories
     */
    if (categoryGroups.docs !== undefined) {
      // Set to zero so each rerender does not start with the total
      // running amount from last render
      setRunningCategoryGroupAmount({ available: 0 });
      categoryGroups.docs.forEach((categoryGroup: any) => {
        const reducedValue = categoryGroup.data().categories.reduce(
          (prev: any, curr: any) => {
            return { available: prev.available + curr.available };
          },
          { available: 0 }
        );

        setRunningCategoryGroupAmount((running: any) => {
          return { available: running.available + reducedValue.available };
        });
      });
    }
  }, [categoryGroups]);

  // Holds the amount for bank accounts after array reduce
  const [runningAccountAmount, setRunningAccountAmount] = useState<any>({
    data: () => {
      return { amount: 0 };
    },
  });

  useEffect(() => {
    /**
     * Calculate the total amount of all accounts
     */
    if (bankAccounts.length > 0) {
      setRunningAccountAmount(
        bankAccounts.reduce((prev: any, curr: any) => {
          return {
            data: () => {
              return { amount: prev.data().amount + curr.data().amount };
            },
          };
        })
      );
    }
  }, [bankAccounts]);

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar
          runningAccountAmount={runningAccountAmount?.data().amount}
          isValidToLoadAccounts={isValidToLoadAccounts}
          setIsValidToLoadAccounts={setIsValidToLoadAccounts}
          isValidToLoadTransactions={isValidToLoadTransactions}
          setIsValidToLoadTransactions={setIsValidToLoadTransactions}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Budget
                runningCategoryGroupAmount={
                  runningCategoryGroupAmount.available
                }
                runningAccountAmount={runningAccountAmount?.data().amount}
                isValidToLoadCategories={isValidToLoadCategories}
                setIsValidToLoadCategories={setIsValidToLoadCategories}
                setRunningCategoryGroupAmount={setRunningCategoryGroupAmount}
              />
            }
          />
          <Route
            path="/AccountTransactions/:name/:id"
            element={
              <Transactions
                isValidToLoadAccounts={isValidToLoadAccounts}
                setIsValidToLoadAccounts={setIsValidToLoadAccounts}
                isValidToLoadCategories={isValidToLoadCategories}
                setIsValidToLoadCategories={setIsValidToLoadCategories}
                isValidToLoadTransactions={isValidToLoadTransactions}
                setIsValidToLoadTransactions={setIsValidToLoadTransactions}
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
