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
import {
  setAllTransactions,
  setEditAccountNameInput,
  setEditAccountWorkingBalanceInput,
  setTotalAmount,
} from "../actions";
import "../styles/css/AccountItem.css";
import EditAccountPopup from "./EditAccountPopup";

interface Props {
  account: QueryDocumentSnapshot;
  setEditAccountPopupStatus: any;
}

function AccountItem(props: Props) {
  const dispatch: Dispatch<any> = useDispatch();

  const moneyAmountTotal = useSelector(
    (state: any) => state.moneyAmountTotalReducer
  );

  // Using useEffect on setTotalCategoryGroupAmount prevents warning with
  // being unable to update a component while rendering a different componenet
  useEffect(() => {
    // Set the total amount for the categories in a category group
    // props.setTotalAmount(
    //   (previousAmount: number) => previousAmount + props.account.data().amount
    // );
    dispatch(
      setTotalAmount(moneyAmountTotal.value + props.account.data().amount)
    );

    return () => {
      //cleanup
    };
  }, []);

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Query to get all transactions in Firebase based on the account
  const transactionsQuery: Query = query(
    collection(getFirestore(), "transactions"),
    where("accountId", "==", `${props.account.id}`)
  );

  const loadTransactions = useCallback(
    async (query: Query) => {
      try {
        console.log(`Load Transaction called.`);
        // don't send again while we are sending
        if (isSending) return;

        // update state
        setIsSending(true);

        // Asynchronous load of all transactions
        const transactionsAsQuerySnapshot: QuerySnapshot = await getDocs(query);

        // Array of QueryDocumentSnapshots that allows for mapping
        const arrayOfQueryDocumentSnapshots: QueryDocumentSnapshot[] =
          transactionsAsQuerySnapshot.docs;

        // once the request is sent, update state again
        // only update if we are still mounted
        if (isMounted.current) setIsSending(false);

        dispatch(setAllTransactions(arrayOfQueryDocumentSnapshots));
      } catch (e) {
        console.log("An error occurred when trying to load your accounts");
        console.log(`Error: ${e}`);
      }
    },
    [isSending]
  );

  /**
   * Handles the result of entering the context menu for a bank account
   * @param event Right click mouse event
   */
  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    props.setEditAccountPopupStatus(true);
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
          onClick={() => loadTransactions(transactionsQuery)}
        >
          <div className="account-name">{props.account.data().title}</div>
          <div className="account-amount">{`$${Number(
            props.account.data().amount
          ).toFixed(2)}`}</div>
        </li>
      </Link>
    </>
  );
}

export default AccountItem;
