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

  // Amount of money with dollar sign and decimal
  const totalAmountFixed = `$${Number(totalAmount).toFixed(2)}`;
  return (
    <>
      <div className="all-accounts">
        <div className="budget-header">
          <div className="budget-title">BUDGET</div>
          <div className="budget-total-amount">{totalAmountFixed}</div>
        </div>
        <div className="account-wrapper">
          <ul className="account-items">
            {props.accounts?.map((account) => {
              return (
                <AccountItem
                  key={account.id}
                  id={account.id}
                  info={account.data()}
                />
              );
            })}
          </ul>
        </div>
      </div>
      <button className="btn-add-account">Add account</button>
    </>
  );
}

export default Accounts;
