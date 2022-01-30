import React from "react";
import { useSelector } from "react-redux";

import "../styles/css/NavBar.css";

interface Props {
  runningCategoryGroupAmount: number;
  runningAccountAmount: number;
}

function NavBar(props: Props) {
  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-left">
          {Number(props.runningCategoryGroupAmount) && (
            <div className="ready-to-assign-amount">{`$${Number(
              props.runningAccountAmount - props.runningCategoryGroupAmount
            ).toFixed(2)}`}</div>
          )}
          <p className="ready-to-assign-title">Ready to Assign</p>
        </div>
        <div className="ready-to-assign-right"></div>
      </div>
    </nav>
  );
}

export default NavBar;
