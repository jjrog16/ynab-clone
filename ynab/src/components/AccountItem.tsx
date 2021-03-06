import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { isUnparsedPrepend } from "typescript";
import {
  setAllTransactions,
  setEditAccountNameInput,
  setEditAccountWorkingBalanceInput,
} from "../actions";
import "../styles/css/AccountItem.css";
import EditAccountPopup from "./EditAccountPopup";

interface Props {
  account: QueryDocumentSnapshot;
  setEditAccountPopupStatus: any;
  isValidToLoadAccounts: boolean;
  editAccountPopupStatus: boolean;
  setIsValidToLoadAccounts: any;
  index: number;
  setAccountIndex: any;
  isValidToLoadTransactions: boolean;
  setIsValidToLoadTransactions: any;
}

function AccountItem(props: Props) {
  const dispatch: Dispatch<any> = useDispatch();

  const [isAccountItemClicked, setIsAccountItemClicked] = useState(false);

  // Using useEffect on setTotalCategoryGroupAmount prevents warning with
  // being unable to update a component while rendering a different componenet
  useEffect(() => {
    // Set the total amount for the categories in a category group
    if (isAccountItemClicked) {
      loadTransactions(transactionsQuery);
      setIsAccountItemClicked(false);
      props.setIsValidToLoadTransactions(false);
    }

    return () => {};
  }, [isAccountItemClicked]);

  // Query to get all transactions in Firebase based on the account
  const transactionsQuery: Query = query(
    collection(getFirestore(), "transactions"),
    where("accountId", "==", `${props.account.id}`)
  );

  const loadTransactions = useCallback(async (query: Query) => {
    try {
      // Asynchronous load of all transactions
      const transactionsAsQuerySnapshot: QuerySnapshot = await getDocs(query);

      // Array of QueryDocumentSnapshots that allows for mapping
      const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
        transactionsAsQuerySnapshot.docs;

      dispatch(setAllTransactions(arrayOfQueryDocumentSnapshots));
    } catch (e) {
      console.log("An error occurred when trying to load your accounts");
      console.log(`Error: ${e}`);
    }
  }, []);

  /**
   * Handles the result of entering the context menu for a bank account
   * @param event Right click mouse event
   */
  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    props.setEditAccountPopupStatus(true);
    props.setAccountIndex(props.index);
    dispatch(setEditAccountNameInput(props.account.data().title));
    dispatch(setEditAccountWorkingBalanceInput(props.account.data().amount));
  }

  return (
    <>
      <Link
        to={`AccountTransactions/${props.account.data().title}/${
          props.account.id
        }`}
      >
        <li
          key={props.account.id}
          className="account"
          onContextMenu={(event) => handleContextMenu(event)}
          onClick={() => {
            setIsAccountItemClicked(true);
          }}
        >
          <div className="account-name" id={props.account.data().title}>
            {props.account.data().title}
          </div>
          <div
            className="account-amount"
            id={`${props.account.data().title}amount`}
          >{`$${Number(props.account.data().amount).toFixed(2)}`}</div>
        </li>
      </Link>
    </>
  );
}

export default AccountItem;
