import React from "react";
import "../styles/css/NavBar.css";

interface Props {
  totalAmount: number;
  setTotalAmount: any;
  totalCategoryGroupAmount: number;
}

function NavBar(props: Props) {
  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-left">
          <div className="ready-to-assign-amount">{`$${
            props.totalAmount - props.totalCategoryGroupAmount
          }`}</div>
          <p className="ready-to-assign-title">Ready to Assign</p>
        </div>
        <div className="read-to-assign-right">
          <div className="btn-holder">
            <button className="btn-assign">Assign</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
