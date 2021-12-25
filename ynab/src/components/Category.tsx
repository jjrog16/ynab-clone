import { QueryDocumentSnapshot } from "@firebase/firestore";
import React from "react";

function Category(props: { info: QueryDocumentSnapshot }) {
  const category = props.info.data();
  return (
    <>
      <li className="category">
        <div className="category-name">{category.title}</div>
        <div className="category-amount">{category.available}</div>
      </li>
    </>
  );
}

export default Category;
