import React, { useEffect, useState } from "react";
import "../../styles/css/Budget.css";
import NavBar from "../NavBar";
import AutoAssignSideBar from "../AutoAssignSideBar";
import {
  collection,
  CollectionReference,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore";
import CategoryGroup from "../CategoryGroup";
import AddComponentPopup from "../AddComponentPopup";

function Budget() {
  // Read what is in the database as an array of QueryDocumentSnapshot, and display
  // groups to UI
  const [allCategoryGroups, setAllCategoryGroups] =
    useState<QueryDocumentSnapshot[]>();

  // Use for initial render of Category Groups and Categories
  useEffect(() => {
    loadGroups(groupsQuery);

    return () => {
      //cleanup
    };
  }, []);

  // Query to get all accounts in Firebase
  const groupsQuery: Query = query(
    collection(getFirestore(), "categoryGroups")
  );

  /**
   * Load Category Groups from Firebase
   * @param query The firebase query to get Docs and store the results as
   * an array of QueryDocumentSnapshot
   */
  async function loadGroups(query: Query) {
    try {
      // Asynchronous load of all accounts based off query
      const groupsAsQuerySnapshot: QuerySnapshot = await getDocs(query);
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

  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

  // Sort responses based on position once they are in
  allCategoryGroups?.sort((a, b) => a.data().position - b.data().position);

  // The latest position is the last position number of the array, or return -1
  const latestPosition = allCategoryGroups
    ? allCategoryGroups[allCategoryGroups.length - 1].data().position
    : -1;

  // The location for where the AddComponentPopup will send data
  const categoryGroupDbLocation: CollectionReference = collection(
    getFirestore(),
    "categoryGroups"
  );

  // Db Object formatting
  const categoryGroupObj = {
    position: latestPosition + 1,
    title: "",
  };

  return (
    <div className="budget-page">
      <NavBar />
      <div className="budget-container">
        <div className="budget-wrapper">
          <div className="category-group-bar">
            <p
              className="add-category-group"
              onClick={() => {
                setAddComponentPopupStatus(!addComponentPopupStatus);
              }}
            >
              + Category Group
            </p>
            {addComponentPopupStatus ? (
              <AddComponentPopup
                componentObjectAdded={categoryGroupObj}
                addLocationForDb={categoryGroupDbLocation}
                rerender={() => loadGroups(groupsQuery)}
                popupStatus={addComponentPopupStatus}
                setPopupStatus={setAddComponentPopupStatus}
              />
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
                      rerender={() => loadGroups(groupsQuery)}
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
