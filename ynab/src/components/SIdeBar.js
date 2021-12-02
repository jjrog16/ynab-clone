import React from "react";
import "../styles/SideBar.css";

function SideBar() {
  return (
    <div className="sidebar-container">
      <div className="account-header">
        <div className="current-budget">My Budget</div>
        <div className="user-account">example@email.com</div>
      </div>
      <div className="overview-sections">
        <div className="budget-overview">Budget</div>
      </div>
      <div className="all-accounts"></div>
      <button className="add-account">Add account</button>
    </div>
  );
}

export default SideBar;
