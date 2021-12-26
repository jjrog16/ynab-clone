import { QueryDocumentSnapshot } from "@firebase/firestore";
import React from "react";
import "../styles/css/Category.css";

function Category(props: { info: QueryDocumentSnapshot }) {
  const category = props.info.data();
  const categoryAvailableFixed = `$${Number(category.available).toFixed(2)}`;
  return (
    <>
      <li key={props.info.id} className="category">
        <div className="category-name">{category.title}</div>
        <div className="category-amount">{categoryAvailableFixed}</div>
      </li>
    </>
  );
}

export default Category;
