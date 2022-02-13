import {
  arrayRemove,
  arrayUnion,
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
import "../styles/css/Category.css";
import EditComponentPopup from "./EditComponentPopup";

interface Props {
  category: { available: number; title: string; position: number };
  categoryGroup: QueryDocumentSnapshot;
  index: number;
  setEditComponentPopupStatus: any;
  isValidToLoadCategories: boolean;
  setIsValidToLoadCategories: any;
}

function Category(props: Props) {
  const dispatch = useDispatch();

  // System colors in SCSS
  const LIGHT_BLUE = "#4795d8";
  const DARK_GRAY = "#656568";

  // Use to know whether or not to show the component for editing a
  const [editComponentPopupStatus, setEditComponentPopupStatus] =
    useState<boolean>(false);

  // Money user is attempting to add
  const [inputState, setInputState] = useState<string>("");

  // State for performing addition
  const [isPlusActive, setIsPlusActive] = useState(false);

  // State for performing subtraction
  const [isMinusActive, setIsMinusActive] = useState(false);

  // Implement context menu //

  // The location for where EditComponentPopup will send data
  // Needs the collection with db, the name of the collection,
  // and the ID of the item being changed
  const categoryGroupDbLocation: DocumentReference = doc(
    collection(getFirestore(), "categoryGroups"),
    props.categoryGroup.id
  );

  // Db Object formatting for when editing a Category Group
  const editedCategoryObj = {
    title: props.category.title,
    available: props.category.available,
    position: props.category.position,
  };

  // Use for knowing where the right click occurred
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    setAnchorPoint({ x: event.pageX, y: event.pageY });
    // Set the popup status for the category
    setEditComponentPopupStatus(true);
  }

  // // set isMounted to false when we unmount the component
  // useEffect(() => {
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  /**
   * When isPlusActive is true, this function
   * takes the input and updates the database
   * asynchronously, rerenders the page, then
   * updates the total Category Group amount
   *
   */
  const addToAvailable = useCallback(async () => {
    // Try to convert to number. If fails, exit
    const strToNum: number = Number(inputState);

    if (!Number.isNaN(strToNum)) {
      // Remove the old entry in array
      await updateDoc(categoryGroupDbLocation, {
        categories: arrayRemove({
          available: props.category.available,
          title: props.category.title,
          position: props.category.position,
        }),
      });

      // Add the new entry to array
      await updateDoc(categoryGroupDbLocation, {
        categories: arrayUnion({
          available: props.category.available + strToNum,
          title: props.category.title,
          position: props.category.position,
        }),
      });

      props.setIsValidToLoadCategories(true);

      // Turn off checking for if Plus was clicked
      setIsPlusActive(false);
    }
  }, [inputState]);

  /**
   * When isMinusActive is true, this function
   * takes the input and updates the database
   * asynchronously, rerenders the page, then
   * updates the total Category Group amount
   *
   */
  const subtractFromAvailable = useCallback(async () => {
    // Try to convert to number. If fails, exit
    const strToNum: number = Number(inputState);

    if (!Number.isNaN(strToNum)) {
      // Remove the old entry in array
      await updateDoc(categoryGroupDbLocation, {
        categories: arrayRemove({
          available: props.category.available,
          title: props.category.title,
          position: props.category.position,
        }),
      });

      // Add the new entry to array
      await updateDoc(categoryGroupDbLocation, {
        categories: arrayUnion({
          available: props.category.available - strToNum,
          title: props.category.title,
          position: props.category.position,
        }),
      });

      props.setIsValidToLoadCategories(true);

      // Turn off checking for if Minus was clicked
      setIsMinusActive(false);
    }
  }, [inputState]);

  /**
   * Handles the user input selection and chooses the correct
   * function to run based on if Plus or Minus was selected.
   * @param e KeyBoardEvent the user enters in the input field
   */
  function handleKeyDown(e: React.KeyboardEvent) {
    // Review event if key pressed is the enter key
    if (e.key === "Enter") {
      // Prevents keyDown from refreshing page
      e.preventDefault();
      if (isPlusActive) {
        addToAvailable();

        // Set Status to false to allow for sequential changes

        // Clear the input field after enter is pressed
        setInputState("");
      }
      if (isMinusActive) {
        subtractFromAvailable();

        // Set Status to false to allow for sequential changes

        // Clear the input field after enter is pressed
        setInputState("");
      }
    }
  }

  return (
    <>
      <li
        key={props.index}
        className="category"
        onContextMenu={(event) => handleContextMenu(event)}
      >
        {editComponentPopupStatus ? (
          <EditComponentPopup
            coordinates={anchorPoint}
            component={props.category}
            componentObjectTemplate={editedCategoryObj}
            componentType={"categories"}
            editLocationForDb={categoryGroupDbLocation}
            setEditComponentPopupStatus={setEditComponentPopupStatus}
            setIsValidToLoadCategories={props.setIsValidToLoadCategories}
          />
        ) : null}
        <div className="category-left-side">
          <div className="category-name">{props.category.title}</div>
        </div>
        <div className="category-right-side">
          <div
            className="plus calc-category-available"
            id={`${props.category.title}-plus`}
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
            id={`${props.category.title}-minus`}
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
              className="et-edit-available"
              id={`${props.category.title}et-edit-available`}
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            ></input>
          </form>
          <div
            className="category-amount"
            id={`${props.category.title}amount`}
          >{`$${Number(props.category.available).toFixed(2)}`}</div>
        </div>
      </li>
    </>
  );
}

export default Category;
