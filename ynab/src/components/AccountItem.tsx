import { DocumentData } from "@firebase/firestore";
import React from "react";
import "../styles/css/AccountItem.css";

function AccountItem(props: { id: string; info: DocumentData }) {
  const fixedAmount = `$${Number(props.info.amount).toFixed(2)}`;
  return (
    <>
      <li key={props.id} className="account">
        <div className="account-name">{props.info.title}</div>
        <div className="account-amount">{fixedAmount}</div>
      </li>
    </>
  );
}

export default AccountItem;
