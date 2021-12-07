import React from "react";
import "../styles/css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-left">
          <div className="ready-to-assign-amount">$1,000.00</div>
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
