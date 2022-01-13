import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTotalCategoryGroupAmount } from "../actions";
import "../styles/css/Category.css";
import EditComponentPopup from "./EditComponentPopup";

interface Props {
  category: any;
  rerender: any;
  setEditComponentPopupStatus: any;
}

function Category(props: Props) {
  const dispatch = useDispatch();

  // System colors in SCSS
  const LIGHT_BLUE = "#4795d8";
  const DARK_GRAY = "#656568";

  const categoryGroupAmountTotal = useSelector(
    (state: any) => state.categoryGroupAmountTotalReducer
  );

  const categories = useSelector((state: any) => state.categoriesReducer.value);

  const isValidToLoad = useSelector(
    (state: any) => state.isValidToLoadReducer.value
  );
  // Use to know whether or not to show the component for editing a
  const [editComponentPopupStatus, setEditComponentPopupStatus] =
    useState<boolean>(false);

  // Money user is attempting to add
  const [inputState, setInputState] = useState<string>("");

  // State for performing addition
  const [isPlusActive, setIsPlusActive] = useState(false);

  // State for performing subtraction
  const [isMinusActive, setIsMinusActive] = useState(false);

  // Status for loading API call
  const [isSending, setIsSending] = useState(false);

  // Keep track of when the component is unmounted
  const isMounted = useRef(true);

  // Using useEffect on setTotalCategoryGroupAmount prevents warning with
  // being unable to update a component while rendering a different componenet
  useEffect(() => {
    // Set the total amount for the categories in a category group
    if (isValidToLoad) {
      dispatch(
        setTotalCategoryGroupAmount(
          categoryGroupAmountTotal.value + props.category.available
        )
      );
    }

    return () => {
      //cleanup
    };
  }, []);

  // Implement context menu //

  // // The location for where EditComponentPopup will send data
  // // Needs the collection with db, the name of the collection,
  // // and the ID of the item being changed
  // const categoryDbLocation: DocumentReference = doc(
  //   collection(getFirestore(), "categoryGroups"),
  //   props.category.id
  // );

  // Db Object formatting for when editing a Category Group
  // const editedCategoryObj = {
  //   position: props.category.data().position,
  //   title: props.category.data().title,
  //   available: props.category.data().available,
  //   groupId: props.category.data().groupId,
  // };

  // Use for knowing where the right click occurred
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    setAnchorPoint({ x: event.pageX, y: event.pageY });
    // Set the popup status for the category
    setEditComponentPopupStatus(true);
  }

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // /**
  //  * When isPlusActive is true, this function
  //  * takes the input and updates the database
  //  * asynchronously, rerenders the page, then
  //  * updates the total Category Group amount
  //  *
  //  */
  // const addToAvailable = useCallback(async () => {
  //   // Try to convert to number. If fails, exit
  //   const strToNum: number = Number(inputState);

  //   if (strToNum) {
  //     // don't send again while we are sending
  //     if (isSending) return;

  //     // update state
  //     setIsSending(true);

  //     await updateDoc(categoryDbLocation, {
  //       available: props.category.data().available + strToNum,
  //       groupId: props.category.data().groupId,
  //       position: props.category.data().position,
  //       title: props.category.data().title,
  //     });

  //     // once the request is sent, update state again
  //     // only update if we are still mounted
  //     if (isMounted.current) setIsSending(false);

  //     // Load from Firebase to cause a rerender since there is a change
  //     props.rerender();

  //     // Update the total amount set for the categories so that Ready to Assign can
  //     // update its state
  //     dispatch(
  //       setTotalCategoryGroupAmount(categoryGroupAmountTotal.value + strToNum)
  //     );

  //     // Turn off checking for if Plus was clicked
  //     setIsPlusActive(false);
  //   }
  // }, [isSending, inputState]);

  // /**
  //  * When isMinusActive is true, this function
  //  * takes the input and updates the database
  //  * asynchronously, rerenders the page, then
  //  * updates the total Category Group amount
  //  *
  //  */
  // const subtractFromAvailable = useCallback(async () => {
  //   // Try to convert to number. If fails, exit
  //   const strToNum: number = Number(inputState);

  //   if (strToNum) {
  //     // don't send again while we are sending
  //     if (isSending) return;

  //     // update state
  //     setIsSending(true);

  //     await setDoc(categoryDbLocation, {
  //       available: props.category.data().available - strToNum,
  //       groupId: props.category.data().groupId,
  //       position: props.category.data().position,
  //       title: props.category.data().title,
  //     });

  //     // once the request is sent, update state again
  //     // only update if we are still mounted
  //     if (isMounted.current) setIsSending(false);

  //     // Load from Firebase to cause a rerender since there is a change
  //     props.rerender();

  //     // Update the total amount set for the categories so that Ready to Assign can
  //     // update its state
  //     dispatch(
  //       setTotalCategoryGroupAmount(categoryGroupAmountTotal.value - strToNum)
  //     );

  //     // Turn off checking for if Minus was clicked
  //     setIsMinusActive(false);
  //   }
  // }, [isSending, inputState]);

  // /**
  //  * Handles the user input selection and chooses the correct
  //  * function to run based on if Plus or Minus was selected.
  //  * @param e KeyBoardEvent the user enters in the input field
  //  */
  // function handleKeyDown(e: React.KeyboardEvent) {
  //   // Review event if key pressed is the enter key
  //   if (e.key === "Enter") {
  //     // Prevents keyDown from refreshing page
  //     e.preventDefault();
  //     if (isPlusActive) {
  //       addToAvailable();
  //       // Clear the input field after enter is pressed
  //       setInputState("");
  //     }
  //     if (isMinusActive) {
  //       subtractFromAvailable();
  //       // Clear the input field after enter is pressed
  //       setInputState("");
  //     }
  //   }
  // }

  return (
    <>
      <li
        key={props.category.id}
        className="category"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        {editComponentPopupStatus ? (
          <EditComponentPopup
            coordinates={anchorPoint}
            component={props.category}
            // componentObjectTemplate={editedCategoryObj}
            componentType={"categories"}
            // editLocationForDb={categoryDbLocation}
            rerender={props.rerender}
            setEditComponentPopupStatus={setEditComponentPopupStatus}
          />
        ) : null}
        <div className="category-left-side">
          <div className="category-name">{props.category.categoryName}</div>
        </div>
        <div className="category-right-side">
          <div
            className="plus calc-category-available"
            style={{ color: isPlusActive ? LIGHT_BLUE : DARK_GRAY }}
            onClick={() => {
              setIsPlusActive(!isPlusActive);
              // Set minus to false since you cannot do both
              setIsMinusActive(false);
            }}
          >
            +
          </div>
          <div
            className="minus calc-category-available"
            style={{ color: isMinusActive ? LIGHT_BLUE : DARK_GRAY }}
            onClick={() => {
              setIsMinusActive(!isMinusActive);
              // Set plus to false since you cannot do both
              setIsPlusActive(false);
            }}
          >
            -
          </div>
          <form>
            <input
              type="text"
              id="et-edit-available"
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              // onKeyDown={(e) => handleKeyDown(e)}
            ></input>
          </form>
          <div className="category-amount">{`$${Number(
            props.category.available
          ).toFixed(2)}`}</div>
        </div>
      </li>
    </>
  );
}

export default Category;
