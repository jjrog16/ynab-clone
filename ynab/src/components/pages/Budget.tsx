import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/css/Budget.css";
import NavBar from "../NavBar";
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  getFirestore,
  query,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "@firebase/firestore";
import CategoryGroup from "../CategoryGroup";
import AddComponentPopup from "../AddComponentPopup";
import EditAccountPopup from "../EditAccountPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategories,
  setCategoryGroups,
  setTotalCategoryGroupAmount,
  toggleAddComponentPopup,
} from "../../actions";

interface Props {}

function Budget(props: Props) {
  const dispatch = useDispatch();

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Query to get all accounts in Firebase
  const groupsQuery: Query = query(
    collection(getFirestore(), "categoryGroups")
  );

  const [categoryGroups, setCategoryGroups] =
    useState<QueryDocumentSnapshot[]>();

  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

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

        // Set the total amount to 0 since each load of the page causes a rerender and calculation
        // for Ready to Assign
        dispatch(setTotalCategoryGroupAmount(0));

        // Store the array of CategoryGroups
        setCategoryGroups(arrayOfQueryDocumentSnapshots);
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

  // Sort responses based on position once they are in
  categoryGroups?.sort(
    (a: any, b: any) => a.data().position - b.data().position
  );

  // Type of component being passed for Edit
  const componentType = "categoryGroups";

  // The latest position is the last position number of the array, or return -1
  const latestPosition =
    categoryGroups && categoryGroups.length > 0
      ? categoryGroups[categoryGroups.length - 1].data().position
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
                componentType={componentType}
                rerender={() => loadCategoryGroups(groupsQuery)}
                setAddComponentPopupStatus={setAddComponentPopupStatus}
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
                AVAILABLE
              </p>
            </div>
          </div>
          <div className="budget-contents">
            <div className="groups-wrapper">
              <div className="groups">
                {categoryGroups?.map((categoryGroup: QueryDocumentSnapshot) => {
                  return (
                    <CategoryGroup
                      key={categoryGroup.id}
                      group={categoryGroup}
                      rerenderLoadCategoryGroups={() =>
                        loadCategoryGroups(groupsQuery)
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
