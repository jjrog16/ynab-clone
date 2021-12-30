import { collection, DocumentData, getFirestore } from "@firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import "../styles/css/AccountItem.css";
import EditAccountPopup from "./EditAccountPopup";

interface Props {
  id: string;
  info: DocumentData;
  editAccountPopupStatus: boolean;
  setEditAccountPopupStatus: any;
}

function AccountItem(props: Props) {
  // Set up the input state to be the passed in title
  const [inputState, setInputState] = useState<string>();

  // Status for loading API call
  const [isSending, setIsSending] = useState<boolean>(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // The location for where the EditAccountPopup will send data
  const accountDbLocation = collection(getFirestore(), "accounts");

  // Use for knowing where the right click occurred
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  /**
   * Handles where the contextual menu appears
   * @param event The right click event
   */
  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    // setAnchorPoint({ x: event.pageX, y: event.pageY });
    setAnchorPoint({ x: 250, y: 250 });
    props.setEditAccountPopupStatus(true);
  }

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fixedAmount = `$${Number(props.info.amount).toFixed(2)}`;
  return (
    <>
      <li
        key={props.id}
        className="account"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        <div className="account-name">{props.info.title}</div>
        <div className="account-amount">{fixedAmount}</div>
      </li>
    </>
  );
}

export default AccountItem;
