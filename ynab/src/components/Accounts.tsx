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
  editAccountNameInput: string;
  setEditAccountNameInput: any;
  editAccountWorkingBalanceInput: string;
  setEditAccountWorkingBalanceInput: any;
  accountPassed: QueryDocumentSnapshot | undefined;
  setAccountPassed: any;
}

function Accounts(props: Props) {
  // Amount of money with dollar sign and decimal
  let totalAmountFixed = `$${Number(props.totalAmount).toFixed(2)}`;

  /**
   * Set of operations to perform once add account button is clicked
   */
  function handleAddAccount() {
    // Set popup to true
    props.setEditAccountPopupStatus(true);

    // Set account name input to be empty
    props.setEditAccountNameInput("");

    // Set working balance input to empty
    props.setEditAccountWorkingBalanceInput("");
  }
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
                  account={account}
                  editAccountPopupStatus={props.editAccountPopupStatus}
                  setEditAccountPopupStatus={props.setEditAccountPopupStatus}
                  editAccountNameInput={props.editAccountNameInput}
                  setEditAccountNameInput={props.setEditAccountNameInput}
                  editAccountWorkingBalanceInput={
                    props.editAccountWorkingBalanceInput
                  }
                  setEditAccountWorkingBalanceInput={
                    props.setEditAccountWorkingBalanceInput
                  }
                  accountPassed={props.accountPassed}
                  setAccountPassed={props.setAccountPassed}
                  totalAmount={props.totalAmount}
                  setTotalAmount={props.setTotalAmount}
                />
              );
            })}
          </ul>
        </div>
      </div>
      <div className="button-add-account-container">
        <button className="btn-add-account" onClick={handleAddAccount}>
          Add account
        </button>
      </div>
    </>
  );
}

export default Accounts;
