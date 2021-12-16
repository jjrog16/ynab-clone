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
  addDoc,
  query,
  onSnapshot,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from "@firebase/firestore";

function App() {
  //
  const [allAccounts, setAllAccounts] = useState<QuerySnapshot[] | undefined>();

  useEffect(() => {
    async function loadAccounts() {
      const accountQuery = query(collection(getFirestore(), "accounts"));
      try {
        const accountsAsQuerySnapshot: QuerySnapshot = await getDocs(
          accountQuery
        );

        // We are passing a QuerySnapshot array so that
        // we are able to use the id passed for each account item in
        // Accounts key
        if (accountsAsQuerySnapshot) setAllAccounts([accountsAsQuerySnapshot]);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }

      //const arrOfAccounts = accounts.docs.map((doc) => doc.data());
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
