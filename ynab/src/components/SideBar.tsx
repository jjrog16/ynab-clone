import React from "react";
import "../styles/css/SideBar.css";
import { useState } from "react";
import Accounts from "./Accounts";
import { QueryDocumentSnapshot } from "@firebase/firestore";

interface Props {
  accounts: QueryDocumentSnapshot[] | undefined;
  totalAmount: number;
  setTotalAmount: any;
}

function SideBar(props: Props) {
  return (
    <div className="sidebar-container">
      <div className="account-header">
        <h2 className="current-budget">My Budget</h2>
        <div className="user-account">example@email.com</div>
      </div>
      <div className="overview-sections">
        <h3 className="page-overview">Budget</h3>
      </div>
      <Accounts
        accounts={props.accounts}
        totalAmount={props.totalAmount}
        setTotalAmount={props.setTotalAmount}
      />
    </div>
  );
}

export default SideBar;
