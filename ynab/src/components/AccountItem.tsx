import {
  collection,
  DocumentData,
  getFirestore,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/css/AccountItem.css";
import EditAccountPopup from "./EditAccountPopup";

interface Props {
  account: QueryDocumentSnapshot;
  editAccountPopupStatus: boolean;
  setEditAccountPopupStatus: any;
  editAccountNameInput: string;
  setEditAccountNameInput: any;
  editAccountWorkingBalanceInput: string;
  setEditAccountWorkingBalanceInput: any;
  accountPassed: QueryDocumentSnapshot | undefined;
  setAccountPassed: any;
  totalAmount: number;
  setTotalAmount: any;
}

function AccountItem(props: Props) {
  // Using useEffect on setTotalCategoryGroupAmount prevents warning with
  // being unable to update a component while rendering a different componenet
  useEffect(() => {
    // Set the total amount for the categories in a category group
    props.setTotalAmount(
      (previousAmount: number) => previousAmount + props.account.data().amount
    );

    return () => {
      //cleanup
    };
  }, []);

  /**
   * Handles the result of entering the context menu for a bank account
   * @param event Right click mouse event
   */
  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    props.setEditAccountPopupStatus(true);
    props.setEditAccountNameInput(props.account.data().title);
    props.setEditAccountWorkingBalanceInput(props.account.data().amount);
    props.setAccountPassed(props.account);
  }

  const fixedAmount = `$${Number(props.account.data().amount).toFixed(2)}`;
  return (
    <>
      <Link to="/AccountTransactions">
        <li
          key={props.account.id}
          className="account"
          onContextMenu={(event) => handleContextMenu(event)}
        >
          <div className="account-name">{props.account.data().title}</div>
          <div className="account-amount">{fixedAmount}</div>
        </li>
      </Link>
    </>
  );
}

export default AccountItem;
