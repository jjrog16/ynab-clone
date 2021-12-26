import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
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
  const [allCategories, setAllCategories] = useState<QueryDocumentSnapshot[]>();

  useEffect(() => {
    async function loadCategories() {
      // Query to get all categories in Firebase

      const categoriesQuery: Query = query(
        collection(getFirestore(), "categories"),
        where("groupId", "==", `${props.group.id}`)
      );

      try {
        // Asynchronous load of all accounts based off query
        const categoriesAsQuerySnapshot: QuerySnapshot = await getDocs(
          categoriesQuery
        );
        // Array of QueryDocumentSnapshots that allows for mapping in AccountItems
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
