import { QueryDocumentSnapshot, QuerySnapshot } from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "../../styles/css/Transactions.css";

interface Props {}

function Transactions(props: Props) {
  /**
   * Tasks to complete:
   *
   * 2. Allow user to save transaction on button press "Save"
   * 3. New transaction saved to db.
   * 4. Category selected should have its values altered in db
   * 5. Account selected should have its values altered in db
   * 6. Set isValidToLoadAccounts, isValidToLoadCategories to true to rerender values
   *
   */

  // Passed in params are the account id passed from accounts.
  // use params.name to get the name of bank. params.id to get the id from the url
  const params = useParams();

  // Collection of all Category groups, which also contain Categories
  const categoryGroups: QuerySnapshot = useSelector(
    (state: any) => state.categoryGroupsReducer.value
  );

  // test for finding category sums
  const [individualCategories, setIndividualCategories] = useState<any>([
    { title: "Ready to Assign" },
  ]);

  useEffect(() => {
    categoryGroups.docs.forEach((categoryGroup) => {
      categoryGroup.data().categories.forEach((category: any) => {
        setIndividualCategories((individualCategories: any) => [
          ...individualCategories,
          category,
        ]);
      });
    });
  }, []);

  // Collection of all categories
  const allCategories = useSelector(
    (state: any) => state.allCategoriesReducer.value
  );

  // Collection of all transactions
  const transactions = useSelector(
    (state: any) => state.transactionsReducer.value
  );

  // Determines if new row to add transaction is shown.
  const [isAddTransactionClicked, setIsAddTransactionClicked] = useState(false);

  const [date, setDate] = useState("");
  const [payee, setPayee] = useState("");
  const [category, setCategory] = useState("");
  const [outflow, setOutflow] = useState("");
  const [inflow, setInflow] = useState("");
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [isValidToLoadTransactions, setIsValidToLoadTransactions] =
    useState(false);

  useEffect(() => {});

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
            <th>DATE</th>
            <th>PAYEE</th>
            <th>CATEGORY</th>
            <th>OUTFLOW</th>
            <th>INFLOW</th>
          </tr>
          {isAddTransactionClicked && (
            <tr>
              <td>
                <input
                  value={date}
                  onChange={({ target: { value } }) => setDate(value)}
                ></input>
              </td>
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
                <td className="date">{transaction.data().date}</td>
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
