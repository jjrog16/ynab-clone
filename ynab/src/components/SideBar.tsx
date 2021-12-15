import React from "react";
import "../styles/css/SideBar.css";
import { useState } from "react";

function SideBar() {
  return (
    <div className="sidebar-container">
      <div className="account-header">
        <h2 className="current-budget">My Budget</h2>
        <div className="user-account">example@email.com</div>
      </div>
      <div className="overview-sections">
        <h3 className="page-overview">Budget</h3>
      </div>
      <div className="all-accounts">
        <div className="budget-header">
          <div className="budget-title">BUDGET</div>
          <div className="budget-total-amount">$1,000.00</div>
        </div>
        <div className="account">
          <div className="account1-name">Fake Bank</div>
          <div className="account1-amount">$1,000.00</div>
        </div>
      </div>
      <button className="add-account">Add account</button>
    </div>
  );
}

export default SideBar;
