import { collection, DocumentData, getFirestore } from "@firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import "../styles/css/AccountItem.css";
import EditAccountPopup from "./EditAccountPopup";

interface Props {
  id: string;
  info: DocumentData;
  editAccountPopupStatus: boolean;
  setEditAccountPopupStatus: any;
  editAccountNameInput: string;
  setEditAccountNameInput: any;
  editAccountWorkingBalanceInput: string;
  setEditAccountWorkingBalanceInput: any;
  accountIdPassed: string;
  setAccountIdPassed: any;
  setTotalAmount: any;
}

function AccountItem(props: Props) {
  // Using useEffect on setTotalCategoryGroupAmount prevents warning with
  // being unable to update a component while rendering a different componenet
  useEffect(() => {
    // Set the total amount for the categories in a category group
    props.setTotalAmount(
      (previousAmount: number) => previousAmount + props.info.amount
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
    props.setEditAccountNameInput(props.info.title);
    props.setEditAccountWorkingBalanceInput(props.info.amount);
    props.setAccountIdPassed(props.id);
  }

  const fixedAmount = `$${Number(props.info.amount).toFixed(2)}`;
  return (
    <>
      <li
        key={props.id}
        className="account"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        <div className="account-name">{props.info.title}</div>
        <div className="account-amount">{fixedAmount}</div>
      </li>
    </>
  );
}

export default AccountItem;
