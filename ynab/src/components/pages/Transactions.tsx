import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "../../styles/css/Transactions.css";

interface Props {
  isValidToLoadAccounts: boolean;
  setIsValidToLoadAccounts: any;
  isValidToLoadCategories: boolean;
  setIsValidToLoadCategories: any;
  isValidToLoadTransactions: boolean;
  setIsValidToLoadTransactions: any;
}

function Transactions(props: Props) {
  /**
   * Tasks to complete:
   *
   * 1. Ensure addTransactionToDb works
   * 2. Enable isValidToLoadTransactions
   * 3. Enable save
   *
   */

  // Passed in params are the account id passed from accounts.
  // use params.name to get the name of bank. params.id to get the id from the url
  const params = useParams();

  // Collection of all Category groups, which also contain Categories
  const categoryGroups: QuerySnapshot = useSelector(
    (state: any) => state.categoryGroupsReducer.value
  );

  // Collection of all accounts
  const accounts = useSelector((state: any) => state.bankAccountsReducer.value);

  const transactionDbLocation = collection(getFirestore(), "transactions");

  // Holds all categories for the dropdown
  const [individualCategories, setIndividualCategories] = useState<any>([
    { title: "Ready to Assign", id: "N/A" },
  ]);

  useEffect(() => {
    /**
     * Build the individual categories by looping through each category group
     * and for each catgory group record its parent's id and the category contents
     */
    if (categoryGroups.docs !== undefined) {
      categoryGroups.docs.forEach((categoryGroup) => {
        categoryGroup.data().categories.forEach((category: any) => {
          setIndividualCategories((individualCategories: any) => [
            ...individualCategories,
            { ...category, id: categoryGroup.id },
          ]);
        });
      });
    }
  }, [categoryGroups]);

  // Collection of all transactions
  const transactions = useSelector(
    (state: any) => state.transactionsReducer.value
  );

  // Determines if new row to add transaction is shown.
  const [isAddTransactionClicked, setIsAddTransactionClicked] = useState(false);

  const [payee, setPayee] = useState("");
  const [category, setCategory] = useState("");
  const [outflow, setOutflow] = useState("");
  const [inflow, setInflow] = useState("");
  const [isSaveClicked, setIsSaveClicked] = useState(false);

  useEffect(() => {
    if (isSaveClicked) {
      addTransactionToDb();
      setIsSaveClicked(false);
      props.setIsValidToLoadTransactions(false);
    }
  }, [isSaveClicked]);

  const addTransactionToDb = async () => {
    if (inflow !== "" || outflow !== "") {
      // The location for where accounts are stored
      const accountDbLocation: DocumentReference = doc(
        collection(getFirestore(), "accounts"),
        params.id
      );

      // Get the correct category
      const chosenCategory = individualCategories.filter(
        (individual: any) => individual.title === category
      )[0];

      // Get correct account
      const chosenAccount = accounts.filter(
        (account: any) => params.id === account.id
      )[0];

      // Location to remove category
      const categoryGroupDbLocation: DocumentReference = doc(
        collection(getFirestore(), "categoryGroups"),
        chosenCategory.id
      );

      // Remove the old entry
      await updateDoc(categoryGroupDbLocation, {
        categories: arrayRemove({
          available: chosenCategory.available,
          title: chosenCategory.title,
          position: chosenCategory.position,
        }),
      });

      // Update the category based on inflow or outflow in db
      if (inflow !== "") {
        const inflowToNum = Number(inflow);

        // Add the new entry to the array
        await updateDoc(categoryGroupDbLocation, {
          categories: arrayUnion({
            available: chosenCategory.available + inflowToNum,
            title: chosenCategory.title,
            position: chosenCategory.position,
          }),
        });

        // update account
        await setDoc(accountDbLocation, {
          amount: chosenAccount.data().amount + inflowToNum,
          title: chosenAccount.data().title,
        });
      }

      if (outflow !== "") {
        const outflowToNum = Number(outflow);

        // Add the new entry to the array
        await updateDoc(categoryGroupDbLocation, {
          categories: arrayUnion({
            available: chosenCategory.available - outflowToNum,
            title: chosenCategory.title,
            position: chosenCategory.position,
          }),
        });

        // update account
        await setDoc(accountDbLocation, {
          amount: chosenAccount.data().amount - outflowToNum,
          title: chosenAccount.data().title,
        });
      }

      // // Push transaction to db
      await addDoc(transactionDbLocation, {
        payee,
        category,
        outflow: Number(outflow),
        inflow: Number(inflow),
        accountId: params.id,
      });

      // Set isValidToLoadAccounts(true)
      props.setIsValidToLoadAccounts(true);

      // Set isValidToLoadCategories(true)
      props.setIsValidToLoadCategories(true);

      // Set isValidToLoadTransactions(true)
      props.setIsValidToLoadTransactions(true);
    }
  };

  return (
    <div>
      <nav className="top-bar">
        <div className="name-of-bank">{params.name}</div>
      </nav>
      <div className="add-transaction-bar">
        <p
          className="add-transaction"
          onClick={() => setIsAddTransactionClicked(!isAddTransactionClicked)}
        >
          + Add Transaction
        </p>
      </div>
      <table className="list-of-transactions">
        <tbody>
          <tr className="transactions-top-row">
            <th>PAYEE</th>
            <th>CATEGORY</th>
            <th>OUTFLOW</th>
            <th>INFLOW</th>
          </tr>
          {isAddTransactionClicked && (
            <tr>
              <td>
                <input
                  value={payee}
                  onChange={({ target: { value } }) => setPayee(value)}
                ></input>
              </td>
              <td>
                <select
                  id="categoryType"
                  onChange={({ target: { value } }) => setCategory(value)}
                >
                  {individualCategories.map((category: any) => {
                    return (
                      <option value={category.title}>{category.title}</option>
                    );
                  })}
                </select>
              </td>
              <td>
                <input
                  value={outflow}
                  onChange={({ target: { value } }) => setOutflow(value)}
                ></input>
              </td>
              <td>
                <input
                  value={inflow}
                  onChange={({ target: { value } }) => setInflow(value)}
                ></input>
              </td>
              <td>
                <button onClick={() => setIsSaveClicked(true)}>Save</button>
              </td>
            </tr>
          )}
          {transactions?.map((transaction: any) => {
            return (
              <tr key={transaction.id}>
                <td className="payee">{transaction.data().payee}</td>
                <td className="category">{transaction.data().category}</td>
                <td className="outflow">
                  {
                    // If there is no data entered, then show the spot as empty
                    transaction.data().outflow === ""
                      ? transaction.data().outflow
                      : `$${Number(transaction.data().outflow).toFixed(2)}`
                  }
                </td>
                <td className="inflow">
                  {
                    // If there is no data entered, then show the spot as empty
                    transaction.data().inflow === ""
                      ? transaction.data().inflow
                      : `$${Number(transaction.data().inflow).toFixed(2)}`
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
