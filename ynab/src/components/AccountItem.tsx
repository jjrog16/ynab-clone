import { DocumentData } from "@firebase/firestore";
import React from "react";
import "../styles/css/AccountItem.css";

function AccountItem(props: { id: string; info: DocumentData }) {
  return (
    <>
      <li key={props.id} className="account">
        <div className="account-name">{props.info.title}</div>
        <div className="account-amount">{props.info.amount}</div>
      </li>
    </>
  );
}

export default AccountItem;
