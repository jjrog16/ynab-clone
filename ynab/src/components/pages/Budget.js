import React from "react";
import "../../styles/css/Budget.css";
import NavBar from "../NavBar";
import AutoAssignSideBar from "../AutoAssignSideBar";

function Budget() {
  return (
    <div className="budget-page">
      <NavBar />
      <div className="budget-container">
        <div className="budget-wrapper">
          <div className="category-group-bar">
            <p className="add-category-group">+ Category Group</p>
          </div>
          <div className="budget-contents">Budget Contents</div>
        </div>
        <AutoAssignSideBar />
      </div>
    </div>
  );
}

export default Budget;
