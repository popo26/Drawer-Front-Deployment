import AccordionItem from "./AccordionItem";
import "../css/Accordion.css";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { Link } from "react-router-dom";
import { useDataContext } from "../context/DataContext";
import { useSelectedScribbleContext } from "../context/SelectedScribbleContext";
import { useUserContext } from "../context/UserContext";

export default function MyAccordion({ expandedIndex, handleExpand }) {
  const { drawers, scribbles } = useDataContext();
  const [selectedScribbleId, setSelectedScribbleId] =
    useSelectedScribbleContext();
  const { user } = useUserContext();

  // ++++++++++++++ Find Scribbles +++++++++++++++++++++++++++++++++++++++++++++

  const findScribbles = (id) => {
    let scribbleArray = [];
    for (let item in scribbles) {
      if (scribbles[item].drawerId == id) {
        scribbleArray.push(scribbles[item]);
      }
    }
    return scribbleArray.map((item) => (
      <Link
        key={item._id}
        to={`/scribble/${item._id}`}
        onClick={() => setSelectedScribbleId(item._id)}
      >
        <p className="individual-scribble">{item.title} </p>
      </Link>
    ));
  };

  // ++++++++++++++ Find Sub Drawers +++++++++++++++++++++++++++++++++++++++++++++
  const findSubDrawers = (id) => {
    let newArray = [];
    let newArray2 = [];
    let newArray3 = [];

    //Collect all sub-drawers
    for (let key in drawers) {
      if (drawers[key].drawerId && drawers[key].rootId == id) {
        newArray.push(drawers[key]);
      }
    }

    // Collect subdrawers that are subdrawers that have parent in this array
    for (let firstRoundObj of newArray) {
      const id = firstRoundObj._id;
      for (let secondRoundObj of newArray) {
        if (secondRoundObj.drawerId == id) {
          let obj = { [`${id}`]: secondRoundObj };
          newArray2.push(obj);
        }
      }
    }

    //Remove drawers that are collected in the above forloop
    for (let array2Obj of newArray2) {
      for (let array1Obj of newArray) {
        if (array1Obj._id == Object.values(array2Obj)[0]._id) {
          newArray.splice(newArray.indexOf(array1Obj), 1);
        }
      }
    }

    //Insert collected subdrawers to the right location
    for (let array2Item of newArray2) {
      for (let array1Item1stRound of newArray) {
        if (Object.values(array2Item)[0].drawerId == array1Item1stRound._id) {
          const index = newArray.indexOf(array1Item1stRound);
          const obj = Object.values(array2Item)[0];

          if (!newArray.includes(obj)) {
            newArray3 = [
              ...newArray.slice(0, index + 1),
              obj,
              ...newArray.slice(index + 1),
            ];
          }

          newArray = newArray3;
        }
      }

      for (let array1Item2ndRound of newArray) {
        if (
          Object.values(array2Item)[0].drawerId !== array1Item2ndRound._id ||
          Object.values(array2Item)[0].rootId == array1Item2ndRound.rootId
        ) {
          const index = newArray.indexOf(array1Item2ndRound);
          const obj = Object.values(array2Item)[0];

          if (!newArray.includes(obj)) {
            newArray3 = [
              ...newArray.slice(0, index + 1),
              obj,
              ...newArray.slice(index + 1),
            ];
          }

          newArray = newArray3;
        }
      }
    }

    return newArray.map((item) => {
      const scribbleList = findScribbles(item._id);
      return (
        <div key={item._id} className="sub-drawer-div">
          <h3 className={"sub-drawer-name indent-" + item.level}>
            {item.name}
          </h3>
          <div>
            {scribbleList.length == 0 ? (
              <h6 className={"no-scribble scrb-indent" + item.level}>
                No Scribbles
              </h6>
            ) : (
              <div
                className={"sub-drawer-scribble-list scrb-indent" + item.level}
              >
                {scribbleList}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // ++++++++++++++ Render Whole List +++++++++++++++++++++++++++++++++++++++++++++
  const renderedList = drawers.map((item) => {
    if (!item.drawerId && item.userId === user._id) {
      const isExpanded = item._id == expandedIndex;
      const triangle = (
        <div className="triangle">
          {" "}
          {isExpanded ? <GoTriangleDown /> : <GoTriangleRight />}
        </div>
      );

      return (
        <AccordionItem
          key={item._id}
          triangle={triangle}
          handleExpand={() => handleExpand(item._id)}
          findSubDrawers={findSubDrawers}
          findScribbles={findScribbles}
          item={item}
          isExpanded={isExpanded}
        />
      );
    }
  });

  return <div className="Accordion">{renderedList}</div>;
}
