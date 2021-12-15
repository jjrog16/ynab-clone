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
} from "@firebase/firestore";

function App() {
  const [allAccounts, setAllAccounts] = useState<DocumentData[]>([]);

  useEffect(() => {
    async function loadAccounts() {
      const accountQuery = query(collection(getFirestore(), "accounts"));
      const accounts = await getDocs(accountQuery);
      const arrOfAccounts = accounts.docs.map((doc) => doc.data());
      setAllAccounts(arrOfAccounts);
    }
    loadAccounts();
    return () => {};
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar />
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
