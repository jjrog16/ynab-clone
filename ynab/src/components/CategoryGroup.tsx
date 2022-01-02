import {
  collection,
  doc,
  DocumentReference,
  getDocs,
  getFirestore,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/css/CategoryGroup.css";
import AddComponentPopup from "./AddComponentPopup";
import Category from "./Category";
import EditComponentPopup from "./EditComponentPopup";

interface Props {
  group: QueryDocumentSnapshot;
  rerenderLoadCategoryGroups: any;
  totalAmount: number;
  totalCategoryGroupAmount: number;
  setTotalCategoryGroupAmount: any;
  readyToAssignTotal: number;
  setReadyToAssignTotal: any;
}

function CategoryGroup(props: Props) {
  // Array of Categories that relate to each category group
  const [allCategories, setAllCategories] = useState<QueryDocumentSnapshot[]>();

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Query to get all categories in Firebase based on corresponding to its
  // correct Category Group parent id
  const categoriesQuery: Query = query(
    collection(getFirestore(), "categories"),
    where("groupId", "==", `${props.group.id}`)
  );

  /**
   * Load Categories from Firebase
   * @param query Type of Firebase query used to load data. Used to get all Categories
   */
  const loadCategories = useCallback(
    async (query: Query) => {
      try {
        // don't send again while we are sending
        if (isSending) return;

        // update state
        setIsSending(true);

        // Set the amount for total category group to 0 to start
        props.setTotalCategoryGroupAmount(0);

        // Asynchronous load of all categories based off query
        const categoriesAsQuerySnapshot: QuerySnapshot = await getDocs(query);

        // Array of QueryDocumentSnapshots that allows for mapping
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          categoriesAsQuerySnapshot.docs;

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        setAllCategories(arrayOfQueryDocumentSnapshots);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    },
    [isSending]
  );

  // set isMounted to false when we unmount the component
  // Dependencies need to be empty to allow for rerendering
  useEffect(() => {
    loadCategories(categoriesQuery);
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Category Group title derived from props
  const categoryGroupTitle: string = props.group.data().title;

  //Sort responses once they are in
  allCategories?.sort((a, b) => a.data().position - b.data().position);

  // Implement adding Category //

  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

  // The latest position is the last position number of the array, or return -1
  let latestPosition: number = 0;

  // Only reassign once we know there is a value
  if (allCategories) {
    if (allCategories.length > 0) {
      // The latest position number in a list of Categories as part of a Category Group
      latestPosition = allCategories[allCategories.length - 1].data().position;
    }
  }

  // The location for where the AddComponentPopup will send data
  const categoryDbLocation = collection(getFirestore(), "categories");

  // Db Object formatting for adding a new category
  const newCategoryObj = {
    position: latestPosition + 1,
    title: "",
    available: 0,
    groupId: props.group.id,
  };

  // Implement context menu //

  // Type of component being passed for Edit
  const componentType = "categoryGroups";

  // The location for where EditComponentPopup will send data
  // Needs the collection with db, the name of the collection,
  // and the ID of the item being changed
  const categoryGroupDbLocation: DocumentReference = doc(
    collection(getFirestore(), componentType),
    props.group.id
  );

  // Db Object formatting for when editing a Category Group
  const editedCategoryGroupObj = {
    position: props.group.data().position,
    title: props.group.data().title,
  };

  // Use for knowing where the right click occurred
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  // Use to know whether or not to show the component for editing a
  const [editComponentPopupStatus, setEditComponentPopupStatus] =
    useState<boolean>(false);

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    setAnchorPoint({ x: event.pageX, y: event.pageY });
    setEditComponentPopupStatus(true);
  }

  return (
    <>
      <div
        className="category-group-title-section"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        {editComponentPopupStatus ? (
          <EditComponentPopup
            coordinates={anchorPoint}
            component={props.group}
            componentObjectTemplate={editedCategoryGroupObj}
            componentType={componentType}
            children={allCategories}
            editLocationForDb={categoryGroupDbLocation}
            rerender={props.rerenderLoadCategoryGroups}
            popupStatus={editComponentPopupStatus}
            setPopupStatus={setEditComponentPopupStatus}
            setTotalCategoryGroupAmount={props.setTotalCategoryGroupAmount}
          />
        ) : null}
        <div className="category-group-title">{categoryGroupTitle}</div>
        <div
          className="plus-add-category"
          onClick={() => setAddComponentPopupStatus(true)}
        >
          +
        </div>
        {addComponentPopupStatus ? (
          <AddComponentPopup
            componentObjectAdded={newCategoryObj}
            addLocationForDb={categoryDbLocation}
            componentType={componentType}
            rerender={() => loadCategories(categoriesQuery)}
            popupStatus={addComponentPopupStatus}
            setPopupStatus={setAddComponentPopupStatus}
          />
        ) : null}
      </div>
      <ul key={props.group.id} className="group-items">
        {allCategories?.map((category) => {
          return (
            <Category
              key={category.id}
              category={category}
              rerender={() => loadCategories(categoriesQuery)}
              setTotalCategoryGroupAmount={props.setTotalCategoryGroupAmount}
              setReadyToAssignTotal={props.setReadyToAssignTotal}
              totalAmount={props.totalAmount}
              totalCategoryGroupAmount={props.totalCategoryGroupAmount}
              readyToAssignTotal={props.readyToAssignTotal}
            />
          );
        })}
      </ul>
    </>
  );
}

export default CategoryGroup;
