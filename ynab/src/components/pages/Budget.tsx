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
import { setCategoryGroups } from "../../actions";

interface Props {
  runningCategoryGroupAmount: number;
  runningAccountAmount: number;
  isValidToLoadCategories: boolean;
  setIsValidToLoadCategories: any;
}

function Budget(props: Props) {
  const dispatch = useDispatch();

  // Query to get all accounts in Firebase
  const groupsQuery: Query = query(
    collection(getFirestore(), "categoryGroups")
  );

  const categoryGroups = useSelector(
    (state: any) => state.categoryGroupsReducer.value
  );

  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

  /**
   * Load Category Groups from Firebase
   * @param query The firebase query to get Docs and store the results as
   * an array of QueryDocumentSnapshot
   */
  const loadCategoryGroups = useCallback(async (query: Query) => {
    try {
      if (props.isValidToLoadCategories) {
        // Asynchronous load of all accounts based off query
        const groupsAsQuerySnapshot: QuerySnapshot = await getDocs(query);
        // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
        // const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
        //   groupsAsQuerySnapshot.docs;

        //dispatch(setCategoryGroups(arrayOfQueryDocumentSnapshots));
        if (!groupsAsQuerySnapshot.empty) {
          dispatch(setCategoryGroups(groupsAsQuerySnapshot));
        }
      }
    } catch (e) {
      console.log("An error occurred when trying to load your accounts");
      console.log(`Error: ${e}`);
    }
  }, []);

  // Use for initial render of Category Groups and Categories
  // Dependencies need to be empty to allow for rerendering
  useEffect(() => {
    if (props.isValidToLoadCategories) {
      loadCategoryGroups(groupsQuery);
      props.setIsValidToLoadCategories(false);
    }
  }, [props.isValidToLoadCategories]);

  // Sort responses based on position once they are in
  categoryGroups.doc?.sort(
    (a: any, b: any) => a.data().position - b.data().position
  );

  // The latest position is the last position number of the array, or return -1
  const latestPosition =
    categoryGroups && categoryGroups.length > 0
      ? categoryGroups[categoryGroups.length - 1].data().position
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
    categories: [],
  };

  return (
    <div className="budget-page">
      <NavBar
        runningCategoryGroupAmount={props.runningCategoryGroupAmount}
        runningAccountAmount={props.runningAccountAmount}
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
                addLocationForDbAsCollectionReference={categoryGroupDbLocation}
                componentType={"categoryGroups"}
                setAddComponentPopupStatus={setAddComponentPopupStatus}
                addLocationForDbAsDocumentReference={null}
                setIsValidToLoadCategories={props.setIsValidToLoadCategories}
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
                {categoryGroups.docs?.map(
                  (
                    categoryGroup: QueryDocumentSnapshot,
                    categoryGroupIndex: number
                  ) => {
                    return (
                      <CategoryGroup
                        key={categoryGroup.id}
                        group={categoryGroup}
                        categoryGroupIndex={categoryGroupIndex}
                        isValidToLoadCategories={props.isValidToLoadCategories}
                        setIsValidToLoadCategories={
                          props.setIsValidToLoadCategories
                        }
                      />
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
