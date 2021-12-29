import "../src/styles/css/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import Budget from "./components/pages/Budget";
import React, { useState, useEffect } from "react";
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
} from "@firebase/firestore";

function App() {
  const [allAccounts, setAllAccounts] = useState<QueryDocumentSnapshot[]>();

  // Keep track of the total amount of money available from all bank accounts
  const [totalAmount, setTotalAmount] = useState(0);

  // Keep track of the total amount of money from a Category Group
  const [totalCategoryGroupAmount, setTotalCategoryGroupAmount] = useState(0);

  useEffect(() => {
    async function loadAccounts() {
      // Query to get all accounts in Firebase
      const accountQuery: Query = query(collection(getFirestore(), "accounts"));
      try {
        // Asynchronous load of all accounts based off query
        const accountsAsQuerySnapshot: QuerySnapshot = await getDocs(
          accountQuery
        );
        // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          accountsAsQuerySnapshot.docs;
        setAllAccounts(arrayOfQueryDocumentSnapshots);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    }
    loadAccounts();
    return () => {
      //cleanup
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar
          accounts={allAccounts}
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
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
