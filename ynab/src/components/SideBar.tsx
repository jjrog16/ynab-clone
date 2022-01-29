import React from "react";
import "../styles/css/SideBar.css";
import { useState } from "react";
import Accounts from "./Accounts";
import { QueryDocumentSnapshot } from "@firebase/firestore";
import { Link } from "react-router-dom";

interface Props {
  runningAccountAmount: number;
}

function SideBar(props: Props) {
  return (
    <div className="sidebar-container">
      <div className="account-header">
        <h2 className="current-budget">My Budget</h2>
        <div className="user-account">example@email.com</div>
      </div>
      <div className="overview-sections">
        <Link to="/">
          <h3 className="page-overview">Budget</h3>
        </Link>
      </div>
      <Accounts runningAccountAmount={props.runningAccountAmount} />
    </div>
  );
}

export default SideBar;
