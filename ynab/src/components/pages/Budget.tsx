import React, { useCallback, useEffect, useRef, useState } from "react";
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

interface Props {
  totalAmount: number;
  setTotalAmount: any;
  totalCategoryGroupAmount: number;
  setTotalCategoryGroupAmount: any;
}

function Budget(props: Props) {
  // Read what is in the database as an array of QueryDocumentSnapshot, and display
  // groups to UI
  const [allCategoryGroups, setAllCategoryGroups] =
    useState<QueryDocumentSnapshot[]>();

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Query to get all accounts in Firebase
  const groupsQuery: Query = query(
    collection(getFirestore(), "categoryGroups")
  );

  /**
   * Load Category Groups from Firebase
   * @param query The firebase query to get Docs and store the results as
   * an array of QueryDocumentSnapshot
   */
  const loadCategoryGroups = useCallback(
    async (query: Query) => {
      try {
        // don't send again while we are sending
        if (isSending) return;

        // update state
        setIsSending(true);

        // Asynchronous load of all accounts based off query
        const groupsAsQuerySnapshot: QuerySnapshot = await getDocs(query);
        // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          groupsAsQuerySnapshot.docs;

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        // Store the array of CategoryGroups
        setAllCategoryGroups(arrayOfQueryDocumentSnapshots);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    },
    [isSending]
  );

  // Use for initial render of Category Groups and Categories
  // Dependencies need to be empty to allow for rerendering
  useEffect(() => {
    loadCategoryGroups(groupsQuery);

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

  // Sort responses based on position once they are in
  allCategoryGroups?.sort((a, b) => a.data().position - b.data().position);

  // Type of component being passed for Edit
  const componentType = "categoryGroups";

  // The latest position is the last position number of the array, or return -1
  const latestPosition =
    allCategoryGroups && allCategoryGroups.length > 0
      ? allCategoryGroups[allCategoryGroups.length - 1].data().position
      : -1;

  // The location for where the AddComponentPopup will send data
  const categoryGroupDbLocation: CollectionReference = collection(
    getFirestore(),
    componentType
  );

  // Db Object formatting
  const categoryGroupObj = {
    position: latestPosition + 1,
    title: "",
  };

  return (
    <div className="budget-page">
      <NavBar
        totalAmount={props.totalAmount}
        setTotalAmount={props.setTotalAmount}
        totalCategoryGroupAmount={props.totalCategoryGroupAmount}
      />
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
                componentType={componentType}
                rerender={() => loadCategoryGroups(groupsQuery)}
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
                      rerender={() => loadCategoryGroups(groupsQuery)}
                      totalCategoryGroupAmount={props.totalCategoryGroupAmount}
                      setTotalCategoryGroupAmount={
                        props.setTotalCategoryGroupAmount
                      }
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
