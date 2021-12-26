import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import "../styles/css/CategoryGroup.css";
import AddComponentPopup from "./AddComponentPopup";
import Category from "./Category";

function CategoryGroup(props: { group: QueryDocumentSnapshot }) {
  // Array of Categories that relate to each category group
  const [allCategories, setAllCategories] = useState<QueryDocumentSnapshot[]>();

  useEffect(() => {
    loadCategories(categoriesQuery);
    return () => {
      //cleanup
    };
  }, []);

  // Query to get all categories in Firebase based on corresponding to its
  // correct Category Group parent id
  const categoriesQuery: Query = query(
    collection(getFirestore(), "categories"),
    where("groupId", "==", `${props.group.id}`)
  );

  async function loadCategories(query: Query) {
    try {
      // Asynchronous load of all accounts based off query
      const categoriesAsQuerySnapshot: QuerySnapshot = await getDocs(query);
      // Array of QueryDocumentSnapshots that allows for mapping
      const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
        categoriesAsQuerySnapshot.docs;
      setAllCategories(arrayOfQueryDocumentSnapshots);
    } catch (e) {
      console.log("An error occurred when trying to load your accounts");
      console.log(`Error: ${e}`);
    }
  }

  // Category Group title derived from props
  const categoryGroupTitle: string = props.group.data().title;

  //Sort responses once they are in
  allCategories?.sort((a, b) => a.data().position - b.data().position);

  // Controls if popup should be visible
  const [popupStatus, setPopupStatus] = useState(false);

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
  const location = collection(getFirestore(), "categories");

  // Db Object formatting
  const categoryObj = {
    position: latestPosition + 1,
    title: "",
    available: 0,
    groupId: props.group.id,
  };

  return (
    <>
      <div className="category-group-title-section">
        <div className="category-group-title">{categoryGroupTitle}</div>
        <div className="plus-add-category" onClick={() => setPopupStatus(true)}>
          +
        </div>
        {popupStatus ? (
          <AddComponentPopup
            componentObjectAdded={categoryObj}
            addLocationForDb={location}
            rerender={() => loadCategories(categoriesQuery)}
            setPopupStatus={setPopupStatus}
          />
        ) : null}
      </div>
      <ul key={props.group.id} className="group-items">
        {allCategories?.map((category) => {
          return <Category key={category.id} info={category} />;
        })}
      </ul>
    </>
  );
}

export default CategoryGroup;
