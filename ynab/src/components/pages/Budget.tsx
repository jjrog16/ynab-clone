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
          <div className="category-assign-activity-available-bar">
            <div className="category-assign-activity-available-bar-left">
              <p className="category-assign-activity-available-bar-item">
                CATEGORY
              </p>
            </div>
            <div className="category-assign-activity-available-bar-right">
              <p className="category-assign-activity-available-bar-item">
                ASSIGNED
              </p>
              <p className="category-assign-activity-available-bar-item">
                ACTIVITY
              </p>
              <p className="category-assign-activity-available-bar-item">
                AVAILABLE
              </p>
            </div>
          </div>
          <div className="budget-contents"></div>
        </div>
        <AutoAssignSideBar />
      </div>
    </div>
  );
}

export default Budget;
