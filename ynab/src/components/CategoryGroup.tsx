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
  isValidToLoadCategories: boolean;
  setIsValidToLoadCategories: any;
}

function CategoryGroup(props: Props) {
  // Controls if popup should be visible
  const [addComponentPopupStatus, setAddComponentPopupStatus] = useState(false);

  // Use to know whether or not to show the component for editing a
  const [editComponentPopupStatus, setEditComponentPopupStatus] =
    useState<boolean>(false);

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
            setEditComponentPopupStatus={setEditComponentPopupStatus}
            setIsValidToLoadCategories={props.setIsValidToLoadCategories}
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
            setAddComponentPopupStatus={setAddComponentPopupStatus}
            addLocationForDbAsCollectionReference={null}
            addLocationForDbAsDocumentReference={categoryGroupDbLocation}
            setIsValidToLoadCategories={props.setIsValidToLoadCategories}
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
              return (
                <Category
                  key={idx}
                  category={category}
                  categoryGroup={props.group}
                  index={idx}
                  setEditComponentPopupStatus={setEditComponentPopupStatus}
                  isValidToLoadCategories={props.isValidToLoadCategories}
                  setIsValidToLoadCategories={props.setIsValidToLoadCategories}
                />
              );
            }
          )}
      </ul>
    </>
  );
}

export default CategoryGroup;
