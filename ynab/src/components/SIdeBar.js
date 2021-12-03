import React from "react";
import "../styles/css/SideBar.css";

function SideBar() {
  return (
    <div className="sidebar-container">
      <div className="account-header">
        <h1 className="current-budget">My Budget</h1>
        <div className="user-account">example@email.com</div>
      </div>
      <div className="overview-sections">
        <h2 className="page-overview">Budget</h2>
      </div>
      <div className="all-accounts"></div>
      <button className="add-account">Add account</button>
    </div>
  );
}

export default SideBar;
