import { QueryDocumentSnapshot } from "@firebase/firestore";
import React, { useState } from "react";
import "../styles/css/Accounts.css";
import AccountItem from "./AccountItem";
function Accounts(props: { accounts: QueryDocumentSnapshot[] | undefined }) {
  return (
    <>
      <div className="all-accounts">
        <div className="budget-header">
          <div className="budget-title">BUDGET</div>
          <div className="budget-total-amount">$1,000.00</div>
        </div>
        <div className="account-wrapper">
          <ul className="account-items">
            {props.accounts?.map((account) => {
              return <AccountItem key={account.id} info={account.data()} />;
            })}
          </ul>
        </div>
      </div>
      <button className="add-account">Add account</button>
    </>
  );
}

export default Accounts;
