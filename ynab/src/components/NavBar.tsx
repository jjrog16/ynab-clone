import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "../styles/css/NavBar.css";

interface Props {
  runningCategoryGroupAmount: number;
  runningAccountAmount: number;
}

function NavBar(props: Props) {
  const [readyToAssign, setReadyToAssign] = useState(0);

  useEffect(() => {
    setReadyToAssign(
      Number(props.runningAccountAmount - props.runningCategoryGroupAmount)
    );
  }, [props]);

  console.log("Ready to assign", readyToAssign);

  return (
    <nav className="navbar">
      <div className="date">DEC 2021</div>
      <div className="ready-to-assign">
        <div className="ready-to-assign-left">
          {!Number.isNaN(readyToAssign) && (
            <div className="ready-to-assign-amount">{`$${Number(
              readyToAssign
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
