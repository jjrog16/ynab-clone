import { DocumentData, QuerySnapshot } from "@firebase/firestore";
import React, { useState } from "react";
import "../styles/css/Accounts.css";
import AccountItem from "./AccountItem";
function Accounts(props: { accounts: QuerySnapshot[] | undefined }) {
  props.accounts?.map((a) => {
    a.forEach((item) => console.log(item.id, item.data()));
  });
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
              account.forEach((acct) => {
                return <AccountItem key={acct.id} info={acct.data} />;
              });
            })}
          </ul>
          <div className="account1-name">Fake Bank</div>
          <div className="account1-amount">$1,000.00</div>
        </div>
      </div>
      <button className="add-account">Add account</button>
    </>
  );
}

export default Accounts;
