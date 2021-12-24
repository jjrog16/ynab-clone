import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";
import { totalmem } from "os";
import React, { useEffect, useState } from "react";
import "../styles/css/Accounts.css";
import AccountItem from "./AccountItem";
function Accounts(props: { accounts: QueryDocumentSnapshot[] | undefined }) {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    props.accounts?.map((account) => {
      const balance: DocumentData = account.data();
      setTotalAmount((prevAmount) => prevAmount + balance.amount);
    });
    return () => {};
  }, [props.accounts]);

  return (
    <>
      <div className="all-accounts">
        <div className="budget-header">
          <div className="budget-title">BUDGET</div>
          <div className="budget-total-amount">{`$${Number(totalAmount).toFixed(
            2
          )}`}</div>
        </div>
        <div className="account-wrapper">
          <ul className="account-items">
            {props.accounts?.map((account) => {
              return <AccountItem key={account.id} info={account.data()} />;
            })}
          </ul>
        </div>
      </div>
      <button className="btn-add-account">Add account</button>
    </>
  );
}

export default Accounts;
