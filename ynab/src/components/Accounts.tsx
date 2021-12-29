import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import "../styles/css/Accounts.css";
import AccountItem from "./AccountItem";

interface Props {
  accounts: QueryDocumentSnapshot[] | undefined;
  totalAmount: number;
  setTotalAmount: any;
}

function Accounts(props: Props) {
  //const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Collect each account balance amount and calculate the total amount for all accounts
    props.accounts?.map((account) => {
      const balance: DocumentData = account.data();
      props.setTotalAmount((prevAmount: number) => prevAmount + balance.amount);
    });
    return () => {};
  }, [props.accounts]);

  // Amount of money with dollar sign and decimal
  const totalAmountFixed = `$${Number(props.totalAmount).toFixed(2)}`;
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
