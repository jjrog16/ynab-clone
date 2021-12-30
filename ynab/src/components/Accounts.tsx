import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import "../styles/css/Accounts.css";
import AccountItem from "./AccountItem";
import EditAccountPopup from "./EditAccountPopup";

interface Props {
  accounts: QueryDocumentSnapshot[] | undefined;
  totalAmount: number;
  setTotalAmount: any;
  editAccountPopupStatus: boolean;
  setEditAccountPopupStatus: any;
}

function Accounts(props: Props) {
  // Controls if popup should be visible
  const [addAccountPopupStatus, setAddAccountPopupStatus] =
    useState<boolean>(false);

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
          <h5 className="budget-title">BUDGET</h5>
          <h5 className="budget-total-amount">{totalAmountFixed}</h5>
        </div>
        <div className="account-wrapper">
          <ul className="account-items">
            {props.accounts?.map((account) => {
              return (
                <AccountItem
                  key={account.id}
                  id={account.id}
                  info={account.data()}
                  editAccountPopupStatus={props.editAccountPopupStatus}
                  setEditAccountPopupStatus={props.setEditAccountPopupStatus}
                />
              );
            })}
          </ul>
        </div>
      </div>
      <div className="button-add-account-container">
        <button
          className="btn-add-account"
          onClick={() => setAddAccountPopupStatus(!addAccountPopupStatus)}
        >
          Add account
        </button>
        {addAccountPopupStatus ? (
          <EditAccountPopup
            coodinates={{
              x: 0,
              y: 0,
            }}
            componentObjectTemplate={undefined}
          />
        ) : null}
      </div>
    </>
  );
}

export default Accounts;
