import React, { useEffect, useState } from "react";
import "../../styles/css/Budget.css";
import NavBar from "../NavBar";
import AutoAssignSideBar from "../AutoAssignSideBar";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore";
import CategoryGroup from "../CategoryGroup";
import AddCategoryGroupPopup from "../AddCategoryGroupPopup";

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

        // Store the array of CategoryGroups
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

  // Shows if popup should be visible
  const [popupStatus, setPopupStatus] = useState(false);

  // Sort responses once they are in
  allCategoryGroups?.sort((a, b) => a.data().position - b.data().position);

  const latestPosition = allCategoryGroups
    ? allCategoryGroups[allCategoryGroups.length - 1].data().position
    : -1;

  return (
    <div className="budget-page">
      <NavBar />
      <div className="budget-container">
        <div className="budget-wrapper">
          <div className="category-group-bar">
            <p
              className="add-category-group"
              onClick={() => {
                setPopupStatus(!popupStatus);
              }}
            >
              + Category Group
            </p>
            {popupStatus ? (
              <AddCategoryGroupPopup currentPosition={latestPosition} />
            ) : null}
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
