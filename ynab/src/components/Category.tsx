import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { Query } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import "../styles/css/Category.css";
import EditComponentPopup from "./EditComponentPopup";

interface Props {
  category: QueryDocumentSnapshot;
  rerender: any;
  totalCategoryGroupAmount: number;
  setTotalCategoryGroupAmount: any;
}

function Category(props: Props) {
  // The data related to a Category as specified in Db
  const category: DocumentData = props.category.data();
  const categoryAvailableFixed = `$${Number(category.available).toFixed(2)}`;

  // Each category will take its amount and total it up. Total amount is kept up to date in App

  // Using useEffect on setTotalCategoryGroupAmount prevents warning with
  // being unable to update a component while rendering a different componenet
  useEffect(() => {
    props.setTotalCategoryGroupAmount(
      (previousAmount: number) => previousAmount + category.available
    );
    return () => {
      //cleanup
    };
  }, []);

  // Implement context menu //

  // Type of component being passed for Edit
  const componentType = "categories";

  // The location for where EditComponentPopup will send data
  // Needs the collection with db, the name of the collection,
  // and the ID of the item being changed
  const categoryDbLocation: DocumentReference = doc(
    collection(getFirestore(), componentType),
    props.category.id
  );

  // Db Object formatting for when editing a Category Group
  const editedCategoryObj = {
    position: props.category.data().position,
    title: props.category.data().title,
    available: props.category.data().available,
    groupId: props.category.data().groupId,
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
      <li
        key={props.category.id}
        className="category"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        {editComponentPopupStatus ? (
          <EditComponentPopup
            coordinates={anchorPoint}
            component={props.category}
            componentObjectTemplate={editedCategoryObj}
            componentType={componentType}
            editLocationForDb={categoryDbLocation}
            rerender={props.rerender}
            popupStatus={editComponentPopupStatus}
            setPopupStatus={setEditComponentPopupStatus}
          />
        ) : null}
        <div className="category-name">{category.title}</div>
        <div className="category-amount">{categoryAvailableFixed}</div>
      </li>
    </>
  );
}

export default Category;
