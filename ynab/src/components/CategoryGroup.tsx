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
import Category from "./Category";

function CategoryGroup(props: { group: QueryDocumentSnapshot }) {
  // Array of Categories that relate to each category group
  const [allCategories, setAllCategories] = useState<QueryDocumentSnapshot[]>();

  useEffect(() => {
    async function loadCategories() {
      // Query to get all categories in Firebase based on corresponding to its
      // correct Category Group parent id
      const categoriesQuery: Query = query(
        collection(getFirestore(), "categories"),
        where("groupId", "==", `${props.group.id}`)
      );

      try {
        // Asynchronous load of all accounts based off query
        const categoriesAsQuerySnapshot: QuerySnapshot = await getDocs(
          categoriesQuery
        );
        // Array of QueryDocumentSnapshots that allows for mapping
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          categoriesAsQuerySnapshot.docs;
        setAllCategories(arrayOfQueryDocumentSnapshots);
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    }
    loadCategories();
    return () => {
      //cleanup
    };
  }, []);

  const categoryGroupTitle: string = props.group.data().title;

  //Sort responses once they are in
  allCategories?.sort((a, b) => a.data().position - b.data().position);

  return (
    <>
      <div className="category-group-title">{categoryGroupTitle}</div>
      <ul key={props.group.id} className="group-items">
        {allCategories?.map((category) => {
          return <Category key={category.id} info={category} />;
        })}
      </ul>
    </>
  );
}

export default CategoryGroup;
