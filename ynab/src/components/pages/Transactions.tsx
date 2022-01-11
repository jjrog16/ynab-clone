import { QueryDocumentSnapshot } from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "../../styles/css/Transactions.css";

interface Props {}

function Transactions(props: Props) {
  // Passed in params are the account id passed from accounts.
  // use params.name to get the name of bank. params.id to get the id from the url
  const params = useParams();

  // Collection of all transactions
  const transactions = useSelector((state: any) => state.transactionsReducer);

  console.log(transactions.value);

  return (
    <div>
      <nav className="top-bar">
        <div className="name-of-bank">{params.name}</div>
      </nav>
      <div className="add-transaction-bar">
        <p className="add-transaction">+ Add Transaction</p>
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

          {transactions?.value.map((transaction: any) => {
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
