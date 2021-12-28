import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { Query } from "@testing-library/react";
import React, { useState } from "react";
import "../styles/css/Category.css";
import EditComponentPopup from "./EditComponentPopup";

interface Props {
  info: QueryDocumentSnapshot;
  rerender: any;
}

function Category(props: Props) {
  // The data related to a Category as specified in Db
  const category: DocumentData = props.info.data();
  const categoryAvailableFixed = `$${Number(category.available).toFixed(2)}`;

  // Implement context menu //

  // The location for where EditComponentPopup will send data
  // Needs the collection with db, the name of the collection,
  // and the ID of the item being changed
  const categoryDbLocation: DocumentReference = doc(
    collection(getFirestore(), "categories"),
    props.info.id
  );

  // Db Object formatting for when editing a Category Group
  const editedCategoryObj = {
    position: props.info.data().position,
    title: props.info.data().title,
    available: props.info.data().available,
    groupId: props.info.data().groupId,
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
        key={props.info.id}
        className="category"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        {editComponentPopupStatus ? (
          <EditComponentPopup
            coordinates={anchorPoint}
            component={props.info}
            componentObjectAdded={editedCategoryObj}
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
