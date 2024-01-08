import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import InputField from "../components/InputField";
import MyButton from "../components/MyButton";
import MyDropdown from "../components/MyDropdown";
import "../css/SortPage.css";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { useSelectedDrawerContext } from "../context/SelectedDrawerContext";
import { useDrawerToBeMovedContext } from "../context/DrawerToBeMovedContext";
import { useDrawerNameContext } from "../context/DrawerNameContext";
import { useUserContext } from "../context/UserContext";

export default function SortDrawerPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { drawers, scribbles, loadingDrawers } = useDataContext();
  const { selectedDrawerId, handleSelectedDrawerId } =
    useSelectedDrawerContext();
  const [drawerToBeMoved, setDrawerToBeMoved] = useDrawerToBeMovedContext();
  const [drawerName, setDrawerName] = useDrawerNameContext();
  const [newDrawerNameFieldSelected, setNewDrawerNameFieldSelected] =
    useState(true);
  const [displayMessage, setDisplayMessage] = useState(
    "Or move it to existing drawer"
  );
  const { user } = useUserContext();

  //++++++++Tooltip++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const tooltipNext = <Tooltip id="tooltip">Next</Tooltip>;

  //+++++++To grab drawerToBeMoved from sessionStorage and set as a state++++++++++++++++++++++++++++++++++++++
  useEffect(() => {
    let drawerToBeMovedSession = sessionStorage.getItem("drawerToBeMoved");
    setDrawerToBeMoved(drawerToBeMovedSession);
    handleSelectedDrawerId("");
  }, []);

  ///NOT WORKING! :-(
  //++++++++Move children to the new drawer in DB +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const moveAllChildrenToNewDrawer = (parentDrawerId, newTopLevelDrawerId) => {
    // parentDrawerId ---> Drawer To Be Moved
    //newTopLevelDrawerId ---> Newly created root drawer
    const drawerToBeMovedObject = drawers.filter(
      (item) => item._id == parentDrawerId
    );

    let subDrawersToBeMoved = [];

    if (drawerToBeMovedObject[0].subDrawer) {
      for (let x in drawers) {
        if (
          drawers[x].drawerId == parentDrawerId ||
          (drawers[x].rootId == drawerToBeMovedObject[0]["rootId"] &&
            drawers[x].level > drawerToBeMovedObject[0]["level"])
          // drawers[x].rootId == parentDrawerId
        ) {
          // subDrawersToBeMoved.push(x);
          subDrawersToBeMoved.push(drawers[x]);
          console.log("subDrawersToBeMoved SORTDRAWER", subDrawersToBeMoved);

          let newLevel;
          // if (drawers[x].drawerId) {
          //   const parentDrawer = drawers.filter(
          //     (item) => item._id == drawers[x].drawerId
          //   );
          //   // newLevel = parentDrawer[0].level + 1;
          //   newLevel = drawers[x].level + 1;

          //   console.log("new Level CCCCCCCCCC", newLevel);
          // } else {
          //   newLevel = 3;
          //   console.log("new Level DDDDDDDD", newLevel);
          // }

          //////WORKING ON THIS/////////////////////////////////////////////////////////////////////
          if (drawers[x].drawerId && drawers[x].drawerId === parentDrawerId) {
            const parentDrawer = drawers.filter(
              (item) => item._id == drawers[x].drawerId
            );
            // newLevel = parentDrawer[0].level + 1;
            newLevel = drawers[x].level + 1;
            console.log(
              `SORT CCCCCCCCCC: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          } else if (
            drawers[x].drawerId &&
            drawers[x].drawerId !== parentDrawerId &&
            drawers[x].rootId === drawerToBeMovedObject[0]["rootId"]
          ) {
            newLevel = drawers[x].level + 1;
            console.log(
              `SORT EEEEEEEEEEEE: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          } else {
            newLevel = 3;
            console.log(
              `SORT DDDDDDDDDDD: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          }
          //////WORKING ON THIS/////////////////////////////////////////////////////////////////////

          
          
          //////WORKING ON THIS COPIED SORTDRAWER PREVIEW LOGIC/////////////////////////////////////////////////////////////////////
          
          // const newTopLevelDrawerObject = drawers.filter(
          //   (item) => item._id == newTopLevelDrawerId
          // );
          
          
          // if (drawers[x].drawerId && drawers[x].drawerId === parentDrawerId) {
          //   const parentDrawer = drawers.filter(
          //     (item) => item._id == drawers[x].drawerId
          //   );
          //   console.log("parentDrawer[0]['level']", parentDrawer[0]["level"]);
          //   // newLevel = parentDrawer[0].level + 1;
          //   //AFTER || added
          //   if (
          //     parentDrawer[0]["level"] === 2 &&
          //     drawerToBeMovedObject[0].level -
          //       newTopLevelDrawerObject[0].level ===
          //       0
          //   ) {
          //     console.log(
          //       "difference in levels",
          //       drawerToBeMovedObject[0].level -
          //         newTopLevelDrawerObject[0].level
          //     );
          //     newLevel = parentDrawer[0].level + 2;
          //     console.log(
          //       `SORT BBBBBBBBBBBB: ${drawers[x].name}, , , Level is ${newLevel}`
          //     );
          //   } else if (
          //     parentDrawer[0]["level"] === 2 &&
          //     drawerToBeMovedObject[0].level -
          //       newTopLevelDrawerObject[0].level >
          //       1
          //   ) {
          //     console.log(
          //       "difference in levels",
          //       drawerToBeMovedObject[0].level -
          //         newTopLevelDrawerObject[0].level
          //     );
          //     newLevel = 3;
          //     console.log(
          //       `SORT AAAAAAAAAA: ${drawers[x].name}, , , Level is ${newLevel}`
          //     );
          //   } else if (parentDrawer[0]["level"] === 2) {
          //     console.log(
          //       "difference in levels",
          //       drawerToBeMovedObject[0].level -
          //         newTopLevelDrawerObject[0].level
          //     );
          //     newLevel = 3;
          //     console.log(
          //       `SORT DDDDDDDDD: ${drawers[x].name}, , , Level is ${newLevel}`
          //     );
          //   } else if (
          //     parentDrawer[0]["level"] > 2 &&
          //     drawerToBeMovedObject[0].level -
          //       newTopLevelDrawerObject[0].level >
          //       0
          //   ) {
          //     console.log(
          //       "difference in levels",
          //       drawerToBeMovedObject[0].level -
          //         newTopLevelDrawerObject[0].level
          //     );
          //     newLevel = newTopLevelDrawerObject[0].level + 2;
          //     console.log(
          //       `SORT HHHHHHHHHHHHH: ${drawers[x].name}, , , Level is ${newLevel}`
          //     );
          //   } else {
          //     newLevel = drawers[x].level + 1;
          //     console.log(
          //       "difference in levels",
          //       drawerToBeMovedObject[0].level -
          //         newTopLevelDrawerObject[0].level
          //     );
          //     console.log(
          //       `SORT CCCCCCCCCC: ${drawers[x].name}, , , Level is ${newLevel}`
          //     );
          //   }
          // } else if (
          //   drawers[x].drawerId &&
          //   drawers[x].drawerId !== parentDrawerId &&
          //   drawers[x].rootId === drawerToBeMovedObject[0]["rootId"]
          // ) {
          //   const directParentDrawer = drawers.filter(
          //     (item) => item._id == drawers[x].drawerId
          //   );
          //   newLevel = directParentDrawer[0].level + 1;
          //   // newLevel = drawers[x].level + 1;
          //   console.log("direct parent drawer".directParentDrawer);
          //   console.log(
          //     `SORT EEEEEEEEEEEE: ${drawers[x].name}, , , Level is ${newLevel}`
          //   );
          // } else if (!drawers[x].drawerId) {
          //   newLevel = 2;
          //   console.log(
          //     `SORT GGGGGGGGGGGGGGGG: ${drawers[x].name}, , , Level is ${newLevel}`
          //   );
          // } else {
          //   newLevel = 3;
          //   console.log(
          //     `SORT FFFFFFFFFFFF: ${drawers[x].name}, , , Level is ${newLevel}`
          //   );
          // }
          ///////////////////////////////////////////////////////////////////////////

          console.log("matching subdrawers", drawers[x]);
          let dataPost = {
            rootId: newTopLevelDrawerId,
            root: false,
            level: newLevel,
          };

          fetch(`https://drawer-backend.onrender.com/api/drawers/${drawers[x]._id}`, {
            method: "PUT",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
          })
            .then((response) => response.json())
            .catch((error) => console.error(error.message));
        }
      }
    }

    for (let x in scribbles) {
      if (scribbles[x].rootDrawerId == parentDrawerId) {
        let dataPost = {
          rootDrawerId: newTopLevelDrawerId,
          stray: false,
          level: drawerToBeMovedObject[0]["level"] + scribbles[x].level,
        };
        fetch(`https://drawer-backend.onrender.com/api/scribbles/${scribbles[x]._id}`, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataPost),
        })
          .then((response) => response.json())
          .catch((error) => console.error(error.message));
      }
    }
  };

  //++++++++Move selected drawer to the new drawer +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const moveDrawerToNewDrawer = (passedId) => {
    let dataPost = {
      rootId: passedId,
      drawerId: passedId,
      root: false,
      level: 2,
    };
    fetch(`https://drawer-backend.onrender.com/api/drawers/${drawerToBeMoved}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      //.then(() => navigate(0))
      .catch((error) => console.error(error.message));
  };

  //++++++++Create new drawer in DB +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const createNewDrawer = () => {
    let dataPost = {
      rootId: drawers.length + 1,
      userId: user._id,
      name: drawerName.toUpperCase(),
      type: "drawer",
      subDrawer: true,
      root: true,
      level: 1,
    };
    fetch("https://drawer-backend.onrender.com/api/drawers/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("You are here1");

        moveDrawerToNewDrawer(json.data._id);
        console.log("You are here2");
        moveAllChildrenToNewDrawer(drawerToBeMoved, json.data._id);
      })
      .catch((error) => console.error(error.message));
  };

  //+++++++To track new drawer name+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const handleChange = (value) => {
    setDrawerName(value);
  };

  //++++++++Create new drawer with alert in case of no input+++++++++++++++++++++++++++++++++++++++++++
  const handleCreate = () => {
    {
      !drawerName ? alert("The new drawer name is empty.") : createNewDrawer();
      setDrawerName("");
      navigate("/home");
      //navigate(0);
    }
  };

  //+++++++++To swap display message on the button++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const handleDisplay = () => {
    setNewDrawerNameFieldSelected(!newDrawerNameFieldSelected);
    {
      displayMessage == "Or move it to existing drawer"
        ? setDisplayMessage("Or create new top level drawer")
        : setDisplayMessage("Or move it to existing drawer");
    }
  };

  //++++++++++To display Source and Destination drawer name at the top of the page++++++++++++++++++++++++
  const drawerToBeMovedObjName = () => {
    if (!loadingDrawers) {
      const obj = drawers.filter(
        (item) => item._id == sessionStorage.getItem("drawerToBeMoved")
      );
      return obj[0]["name"];
    }
  };

  const destinationDrawerObjName = () => {
    if (!loadingDrawers) {
      const obj = drawers.filter((item) => item._id == selectedDrawerId);
      return obj[0]["name"];
    }
  };

  return (
    <div id="page">
      <h4 className="sort-drawer-title">
        {sessionStorage.getItem("drawerToBeMoved") &&
          !loadingDrawers &&
          drawerToBeMovedObjName()}
        <Icon icon="mingcute:drawer-line" color="red" />
        <Icon icon="ri:arrow-right-fill" />
        {selectedDrawerId && destinationDrawerObjName()}
        <Icon icon="mingcute:drawer-line" color="red" />
      </h4>

      {newDrawerNameFieldSelected && (
        <div>
          <InputField
            type="text"
            name="create-new-drawer"
            id="create-new-drawer"
            placeholder="Create new TOP-level drawer"
            value={drawerName}
            handleNewDrawerChange={handleChange}
          />
          <br />
          <MyButton
            href={null}
            btnName={<Icon icon="ic:baseline-move-down" width="30" />}
            handleNewDrawerCreate={handleCreate}
            drawerName={drawerName}
          />
        </div>
      )}

      <Button onClick={handleDisplay} className="sort-msg-btn" variant="dark">
        {displayMessage}
      </Button>

      {!newDrawerNameFieldSelected && (
        <>
          <div>
            <MyDropdown user={user} />
          </div>
          <OverlayTrigger placement="right" overlay={tooltipNext}>
            <Button
              variant="dark"
              className="next-btn"
              onClick={(e) => {
                e.preventDefault();
                let passingData = { selectedDrawerId, drawerToBeMoved };
                {
                  !selectedDrawerId
                    ? alert("Please select destination drawer")
                    : navigate("/sort-drawer-preview", { state: passingData });
                  sessionStorage.setItem("selectedDrawerId", selectedDrawerId);
                }
              }}
            >
              <Icon icon="tabler:player-track-next-filled" />
            </Button>
          </OverlayTrigger>
        </>
      )}

      <div>
        <Icon
          icon="icon-park-outline:back"
          color="black"
          width="50"
          onClick={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
