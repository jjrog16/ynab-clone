import React, { useEffect, useState } from "react";
import "../../styles/css/Budget.css";
import NavBar from "../NavBar";
import AutoAssignSideBar from "../AutoAssignSideBar";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore";
import GroupItems from "../CategoryGroup";
import CategoryGroup from "../CategoryGroup";

function Budget() {
  // Read what is in the database as an array of QueryDocumentSnapshot, and display
  // groups to UI
  const [allCategoryGroups, setAllCategoryGroups] =
    useState<QueryDocumentSnapshot[]>();

  useEffect(() => {
    async function loadGroups() {
      // Query to get all accounts in Firebase
      const groupsQuery: Query = query(
        collection(getFirestore(), "categoryGroups")
      );
      try {
        // Asynchronous load of all accounts based off query
        const groupsAsQuerySnapshot: QuerySnapshot = await getDocs(groupsQuery);
        // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          groupsAsQuerySnapshot.docs;
        setAllCategoryGroups(arrayOfQueryDocumentSnapshots);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    }
    loadGroups();
    return () => {
      //cleanup
    };
  }, []);

  return (
    <div className="budget-page">
      <NavBar />
      <div className="budget-container">
        <div className="budget-wrapper">
          <div className="category-group-bar">
            <p
              className="add-category-group"
              onClick={() => console.log("Add Category Group clicked")}
            >
              + Category Group
            </p>
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
          <div className="budget-contents">
            <div className="groups-wrapper">
              <div className="groups">
                {allCategoryGroups?.map((categoryGroup) => {
                  return (
                    <CategoryGroup
                      key={categoryGroup.id}
                      group={categoryGroup}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <AutoAssignSideBar />
      </div>
    </div>
  );
}

export default Budget;
