import "../css/Dropdown.css";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { useSelectedDrawerContext } from "../context/SelectedDrawerContext";
import { useDrawerToBeMovedContext } from "../context/DrawerToBeMovedContext";
import { useUserContext } from "../context/UserContext";

export default function MyDropdown() {
  const [open, setOpen] = useState(false);
  const [currentDropdown, setCurrentDropDown] = useState("Existing Drawers");
  const { drawers } = useDataContext();
  const { handleSelectedDrawerId } = useSelectedDrawerContext();
  const [drawerToBeMoved] = useDrawerToBeMovedContext();
  const { user } = useUserContext();

  //++++++++++NOt sure if I need this++++++++++++++++++++
  // const handleOpen = () => {
  //   setOpen(!open);
  // };

  // ++++++++++++++ Find Sub Drawers +++++++++++++++++++++++++++++++++++++++++++++
  const findSubDrawers = (id) => {
    let newArray = [];
    let newArray2 = [];
    let newArray3 = [];

    //Collect all sub-drawers
    for (let item in drawers) {
      if (drawers[item].drawerId && drawers[item].rootId == id) {
        newArray.push(drawers[item]);
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
      return (
        <div key={item._id}>
          {item._id == drawerToBeMoved || item.rootId == drawerToBeMoved ? (
            <p
              className={"sub-drawer indent-" + item.level}
              style={{ color: "red" }}
            >
              {item.name}
              <Icon icon="healthicons:stop" color="red" width="18" />
            </p>
          ) : (
            <p
              className={"sub-drawer indent-" + item.level}
              onClick={() => {
                setCurrentDropDown(item.name);
                handleSelectedDrawerId(item._id);
              }}
            >
              {item.name}
            </p>
          )}
        </div>
      );
    });
  };

  // ++++++++++++++ existingDrawerList +++++++++++++++++++++++++++++++++++++++++++++
  const existingDrawersList = drawers.map((item) => {
    if (item.root === true && item.userId === user._id) {
      return (
        <>
          {item._id == drawerToBeMoved ? (
            <div key={item._id} style={{ color: "red" }}>
              <p className="top-drawer">
                {item.name}
                <Icon icon="healthicons:stop" color="red" width="18" />
              </p>
            </div>
          ) : (
            <div
              key={item._id}
              onClick={() => {
                setCurrentDropDown(item.name);
                handleSelectedDrawerId(item._id);
              }}
            >
              <p className="top-drawer">{item.name}</p>
            </div>
          )}
          <div>
            {item["subDrawer"] === true ? (
              <>{findSubDrawers(item._id)} </>
            ) : null}
          </div>
        </>
      );
    }
  });

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          {currentDropdown}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>{existingDrawersList}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
