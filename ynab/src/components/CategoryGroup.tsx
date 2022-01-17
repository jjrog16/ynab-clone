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
import { useDispatch, useSelector } from "react-redux";
import "../styles/css/CategoryGroup.css";
import AddComponentPopup from "./AddComponentPopup";
import Category from "./Category";
import EditComponentPopup from "./EditComponentPopup";

interface Props {
  group: QueryDocumentSnapshot;
  categoryGroupIndex: number;
  rerenderLoadCategoryGroups: any;
}

function CategoryGroup(props: Props) {
  const dispatch = useDispatch();

  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

  // Use to know whether or not to show the component for editing a
  const [editComponentPopupStatus, setEditComponentPopupStatus] =
    useState<boolean>(false);

  const categoryGroups = useSelector(
    (state: any) => state.categoryGroupsReducer.value
  );

  // // Status for loading API call
  // const [isSending, setIsSending] = useState(false);

  // // Keep track of when the component is unmounted
  // const isMounted = useRef(true);

  // // Query to get all categories in Firebase based on corresponding to its
  // // correct Category Group parent id
  // const categoriesQuery: Query = query(
  //   collection(getFirestore(), "categories"),
  //   where("groupId", "==", `${props.group.id}`)
  // );

  // /**
  //  * Load Categories from Firebase
  //  * @param query Type of Firebase query used to load data. Used to get all Categories
  //  */
  // const loadCategories = useCallback(
  //   async (query: Query) => {
  //     try {
  //       // don't send again while we are sending
  //       if (isSending) return;

  //       // update state
  //       setIsSending(true);

  //       // Set the amount for total category group to 0 to start
  //       //dispatch(setTotalCategoryGroupAmount(0));

  //       // Asynchronous load of all categories based off query
  //       const categoriesAsQuerySnapshot: QuerySnapshot = await getDocs(query);

  //       // Array of QueryDocumentSnapshots that allows for mapping
  //       const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
  //         categoriesAsQuerySnapshot.docs;

  //       // once the request is sent, update state again
  //       // only update if we are still mounted
  //       if (isMounted.current) setIsSending(false);

  //       dispatch(setCategories(arrayOfQueryDocumentSnapshots));
  //       //setCategories(arrayOfQueryDocumentSnapshots);
  //     } catch (e) {
  //       console.log("An error occurred when trying to load your accounts");
  //       console.log(`Error: ${e}`);
  //     }
  //   },
  //   [isSending]
  // );

  // // set isMounted to false when we unmount the component
  // // Dependencies need to be empty to allow for rerendering
  // useEffect(() => {
  //   //loadCategories(categoriesQuery);
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  // Category Group title derived from props
  const categoryGroupTitle: string = props.group.data().title;

  //Sort responses once they are in
  const sortedCategories = props.group
    .data()
    .categories?.sort((a: any, b: any) => a["position"] - b["position"]);

  // Implement adding Category //

  // The latest position is the last position number of the array, or return -1
  let latestPosition: number = 0;

  // Only reassign once we know there is a value
  if (sortedCategories) {
    if (sortedCategories.length > 0) {
      // The latest position number in a list of Categories as part of a Category Group
      latestPosition = sortedCategories[sortedCategories.length - 1].position;
    }
  }

  // Db Object formatting for adding a new category
  const newCategoryObj = {
    position: latestPosition + 1,
    title: "",
    available: 0,
  };

  // Implement context menu //

  // The location for where EditComponentPopup will send data
  // Needs the collection with db, the name of the collection,
  // and the ID of the item being changed
  const categoryGroupDbLocation: DocumentReference = doc(
    collection(getFirestore(), "categoryGroups"),
    props.group.id
  );

  // Db Object formatting for when editing a Category Group
  const editedCategoryGroupObj = {
    position: props.group.data().position,
    title: props.group.data().title,
    categories: props.group.data().categories,
  };

  // Use for knowing where the right click occurred
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  // Handle for when a user right clicks a Category Group
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
            componentType={"categoryGroups"}
            editLocationForDb={categoryGroupDbLocation}
            rerender={props.rerenderLoadCategoryGroups}
            setEditComponentPopupStatus={setEditComponentPopupStatus}
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
            componentType={"categories"}
            rerender={props.rerenderLoadCategoryGroups}
            setAddComponentPopupStatus={setAddComponentPopupStatus}
            addLocationForDbAsCollectionReference={null}
            addLocationForDbAsDocumentReference={categoryGroupDbLocation}
          />
        ) : null}
      </div>
      <ul key={props.group.id} className="group-items">
        {props.group
          .data()
          .categories.map(
            (
              category: { available: number; title: string; position: number },
              idx: number
            ) => {
              // TODO: Set this global
              const isLastCategory =
                categoryGroups.length - 1 === props.categoryGroupIndex &&
                props.group.data().categories.length - 1 === idx
                  ? true
                  : false;
              return (
                <Category
                  key={idx}
                  category={category}
                  categoryGroup={props.group}
                  isLastCategory={isLastCategory}
                  index={idx}
                  rerender={props.rerenderLoadCategoryGroups}
                  setEditComponentPopupStatus={setEditComponentPopupStatus}
                />
              );
            }
          )}
      </ul>
    </>
  );
}

export default CategoryGroup;
