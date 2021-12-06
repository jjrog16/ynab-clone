import React from "react";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-amount">$1,000.00</div>
        <p className="ready-to-assign-title">Ready to Assign</p>
        <button className="btn-assign">Assign</button>
      </div>
    </nav>
  );
}

export default NavBar;
