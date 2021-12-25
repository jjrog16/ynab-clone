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
import Category from "./Category";

function CategoryGroup(props: { group: QueryDocumentSnapshot }) {
  console.log(props.group.id);
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

  return (
    <>
      <div className="category-group-title">{props.group.data().title}</div>
      <ul className="group-items">
        {allCategories?.map((category) => {
          return <Category key={category.data().id} info={category} />;
        })}
      </ul>
    </>
  );
}

export default CategoryGroup;
