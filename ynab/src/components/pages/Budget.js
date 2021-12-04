import React from "react";
import "../../styles/css/Budget.css";
import NavBar from "../NavBar";
import AutoAssignSideBar from "../AutoAssignSideBar";

function Budget() {
  return (
    <div>
      <NavBar />
      <div className="budget-container">
        <div className="budget-wrapper">
          <div className="category-group-bar">Category Group Bar</div>
          <div className="budget-contents">Budget Contents</div>
        </div>
        <AutoAssignSideBar />
      </div>
    </div>
  );
}

export default Budget;
