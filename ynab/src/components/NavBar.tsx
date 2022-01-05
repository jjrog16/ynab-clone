import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { setReadyToAssignTotal } from "../actions";
import "../styles/css/NavBar.css";

interface Props {}

function NavBar(props: Props) {
  const dispatch: Dispatch<any> = useDispatch;

  const moneyTotalAmount = useSelector(
    (state: any) => state.moneyTotalAmountReducer
  );
  const categoryGroupAmountTotal = useSelector(
    (state: any) => state.categoryGroupAmountTotalReducer
  );
  const readyToAssignTotal = useSelector(
    (state: any) => state.readyToAssignTotalReducer
  );

  dispatch(setReadyToAssignTotal(moneyTotalAmount - categoryGroupAmountTotal));

  // Watch for Total Amount to make sure RTA is set even when the Total Category is 0
  // Watch Total Category Group Amount changes and update accordingly for RTA
  useEffect(() => {
    return () => {};
  }, [moneyTotalAmount, categoryGroupAmountTotal]);

  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-left">
          <div className="ready-to-assign-amount">{`$${readyToAssignTotal}`}</div>
          <p className="ready-to-assign-title">Ready to Assign</p>
        </div>
        <div className="ready-to-assign-right">
          <div className="btn-holder">
            <button className="btn-assign">Assign</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
