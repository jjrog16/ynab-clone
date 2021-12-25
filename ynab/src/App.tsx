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
    return () => {};
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar accounts={allAccounts} />
        <Routes>
          <Route path="/" element={<Budget />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export default App;
