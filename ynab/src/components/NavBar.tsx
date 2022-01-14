import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { setIsValidToLoad, setTotalCategoryGroupAmount } from "../actions";
import "../styles/css/NavBar.css";

interface Props {
  runningCategoryGroupAmount: number;
}

function NavBar(props: Props) {
  const moneyAmountTotal = useSelector(
    (state: any) => state.moneyAmountTotalReducer
  );
  // const categoryGroupAmountTotal = useSelector(
  //   (state: any) => state.categoryGroupAmountTotalReducer.value
  // );

  // let totalGroupAmount = 0;

  // const categoryGroups = useSelector(
  //   (state: any) => state.categoryGroups.value
  // );

  // useEffect(() => {
  //   totalGroupAmount = categoryGroupAmountTotal.reduce(
  //     (prev: any, curr: any) => prev + curr
  //   );
  // }, [categoryGroups]);

  // const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-left">
          <div className="ready-to-assign-amount">{`$${Number(
            moneyAmountTotal.value - props.runningCategoryGroupAmount
          ).toFixed(2)}`}</div>
          <p className="ready-to-assign-title">Ready to Assign</p>
        </div>
        <div className="ready-to-assign-right"></div>
      </div>
    </nav>
  );
}

export default NavBar;
