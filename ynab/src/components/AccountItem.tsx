import { DocumentData } from "@firebase/firestore";
import React from "react";
import "../styles/css/AccountItem.css";

function AccountItem(props: { key: string; info: DocumentData }) {
  console.log(props);
  return (
    <>
      <li key={props.key} className="account">
        <div className="account-name">{props.info.title}</div>
        <div className="account-amount">{props.info.amount}</div>
      </li>
    </>
  );
}

export default AccountItem;
