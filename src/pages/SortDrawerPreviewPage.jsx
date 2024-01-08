import { Icon } from "@iconify/react";
import "../css/SortPreviewPage.css";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { useSelectedDrawerContext } from "../context/SelectedDrawerContext";
import { useDrawerToBeMovedContext } from "../context/DrawerToBeMovedContext";
import ListConstructionService from "../utils/ListConstructionService";

export default function SortDrawerPreviewPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { drawers, scribbles, loadingDrawers } = useDataContext();
  const { selectedDrawerId, handleSelectedDrawerId } =
    useSelectedDrawerContext();
  const [drawerToBeMoved, setDrawerToBeMoved] = useDrawerToBeMovedContext();

  //Not in use? - delete them after I check
  // //To persist those 2 values incase of browser refresh -- moved to context?
  // const drawerToBeMovedObj = drawers.filter(
  //   (item) => item._id == sessionStorage.getItem("drawerToBeMoved")
  // );
  // const destinationObj = drawers.filter(
  //   (item) => item._id == sessionStorage.getItem("selectedDrawerId")
  // );

  //+++++++++++Tooltips++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const tooltipMoveHere = <Tooltip id="tooltip">Move Here</Tooltip>;

  //++++++++++To persist those 2 values incase of browser refresh+++++++++++++++++++++
  useEffect(() => {
    setDrawerToBeMoved(sessionStorage.getItem("drawerToBeMoved"));
    handleSelectedDrawerId(sessionStorage.getItem("selectedDrawerId"));
  }, []);

  //++++++Update Parent Drawer's Boolean (subDrawer to be true) +++++++++++++++++++++
  const updateParentDrawerBoolean = (parentDrawerId) => {
    let dataPost;
    const parentDrawerObj = drawers.filter(
      (item) => item._id == parentDrawerId
    );

    parentDrawerObj[0]["drawerId"]
      ? (dataPost = {
          ["subDrawer"]: true,
        })
      : (dataPost = {
          ["subDrawer"]: true,
          level: 1,
          root: true,
        });

    fetch(`http://localhost:8080/api/drawers/${parentDrawerId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message));
  };

  //+++++++Move All Children (both sub-drawers and scribbles) to the new drawer ++++++++++++
  const moveAllChildrenToNewDrawer = (parentDrawerId, newTopLevelDrawerId) => {
    const drawerToBeMovedObject = drawers.filter(
      (item) => item._id == parentDrawerId
    );

    const newTopLevelDrawerObject = drawers.filter(
      (item) => item._id == newTopLevelDrawerId
    );

    let subDrawersToBeMoved = [];

    for (let x in drawers) {
      if (
        drawers[x].drawerId == parentDrawerId ||
        (drawers[x].rootId == drawerToBeMovedObject[0]["rootId"] &&
          drawers[x].level > drawerToBeMovedObject[0]["level"])
      ) {
        subDrawersToBeMoved.push(drawers[x]);

        let newLevel;
        // if (drawers[x].drawerId) {
        //   const parentDrawer = drawers.filter(
        //     (item) => item._id == drawers[x].drawerId
        //   );
        //   // newLevel = parentDrawer[0].level + 1;
        //   newLevel = drawers[x].level + 1;

        // } else {
        //   newLevel = 3;
        // }

        //////WORKING ON THIS/////////////////////////////////////////////////////////////////////
        if (drawers[x].drawerId && drawers[x].drawerId === parentDrawerId) {
          const parentDrawer = drawers.filter(
            (item) => item._id == drawers[x].drawerId
          );
          console.log("parentDrawer[0]['level']", parentDrawer[0]["level"]);
          // newLevel = parentDrawer[0].level + 1;
          //AFTER || added
          if (
            parentDrawer[0]["level"] === 2 &&
            drawerToBeMovedObject[0].level -
              newTopLevelDrawerObject[0].level ===
              0
          ) {
            console.log(
              "difference in levels",
              drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level
            );
            newLevel = parentDrawer[0].level + 2;
            console.log(
              `DRAWER-PREVIEW BBBBBBBBBBBB: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          } else if (
            parentDrawer[0]["level"] === 2 &&
            drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level >
              1
          ) {
            console.log(
              "difference in levels",
              drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level
            );
            newLevel = 3;
            console.log(
              `DRAWER-PREVIEW AAAAAAAAAA: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          } else if (parentDrawer[0]["level"] === 2) {
            console.log(
              "difference in levels",
              drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level
            );
            newLevel = 3;
            console.log(
              `DRAWER-PREVIEW DDDDDDDDD: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          } else if (
            parentDrawer[0]["level"] > 2 &&
            drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level >
              0
          ) {
            console.log(
              "difference in levels",
              drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level
            );
            newLevel = newTopLevelDrawerObject[0].level + 2;
            console.log(
              `DRAWER-PREVIEW HHHHHHHHHHHHH: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          } else {
            newLevel = drawers[x].level + 1;
            console.log(
              "difference in levels",
              drawerToBeMovedObject[0].level - newTopLevelDrawerObject[0].level
            );
            console.log(
              `DRAWER-PREVIEW CCCCCCCCCC: ${drawers[x].name}, , , Level is ${newLevel}`
            );
          }
        } else if (
          drawers[x].drawerId &&
          drawers[x].drawerId !== parentDrawerId &&
          drawers[x].rootId === drawerToBeMovedObject[0]["rootId"]
        ) {
          const directParentDrawer = drawers.filter(
            (item) => item._id == drawers[x].drawerId
          );
          newLevel = directParentDrawer[0].level + 1;
          // newLevel = drawers[x].level + 1;
          console.log("direct parent drawer". directParentDrawer)
          console.log(
            `DRAWER-PREVIEW EEEEEEEEEEEE: ${drawers[x].name}, , , Level is ${newLevel}`
          );
        } else if (!drawers[x].drawerId) {
          newLevel = 2;
          console.log(
            `DRAWER-PREVIEW GGGGGGGGGGGGGGGG: ${drawers[x].name}, , , Level is ${newLevel}`
          );
        } else {
          newLevel = 3;
          console.log(
            `DRAWER-PREVIEW FFFFFFFFFFFF: ${drawers[x].name}, , , Level is ${newLevel}`
          );
        }
        ///////////////////////////////////////////////////////////////////////////

        let dataPost = {
          rootId: newTopLevelDrawerObject[0]["rootId"],

          root: false,
          level: newLevel,
        };

        fetch(`http://localhost:8080/api/drawers/${drawers[x]._id}`, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataPost),
        })
          .then((response) => response.json())
          .catch((error) => console.error(error.message));
      } else {
        console.log("You are HERE", drawers[x].name);
      }
    }

    for (let x in scribbles) {
      if (scribbles[x].rootDrawerId == parentDrawerId) {
        let dataPost = {
          rootDrawerId: newTopLevelDrawerId,
          stray: false,
          level: newTopLevelDrawerObject[0]["level"] + scribbles[x].level,
        };
        fetch(`http://localhost:8080/api/scribbles/${scribbles[x]._id}`, {
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

  //++++++++++++++Move selected drawer to new parent drawer+++++++++++++++++++++++++++++++++++++++++++++
  const moveDrawerToNewDrawer = (passedId) => {
    // const parentDrawerObject = drawers.filter((item) => item._id == passedId);
    // console.log("Sort-Preview, Move Drawer", parentDrawerObject[0]["rootId"])

    // let dataPost = {
    //   rootId: parentDrawerObject[0]["rootId"],
    //   drawerId: parentDrawerObject[0]["_id"],
    //   root: false,
    //   level: parentDrawerObject[0]["level"] + 1,
    // };

    const parentDrawerObject = drawers.find((item) => item._id == passedId);
    console.log(
      "Sort-Preview, Move Drawer ROOTID",
      parentDrawerObject["rootId"]
    );
    console.log("Sort-Preview, Move Drawer _ID", parentDrawerObject["_id"]);

    let dataPost = {
      rootId: parentDrawerObject["rootId"],
      drawerId: parentDrawerObject["_id"],
      root: false,
      level: parentDrawerObject["level"] + 1,
    };
    fetch(`http://localhost:8080/api/drawers/${drawerToBeMoved}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message));
  };

  //++++++++++++++++++++++++++This is where to use above 3 functions ++++++++++++++++++++++++++++++++++++++++
  const handleMoveHere = () => {
    moveDrawerToNewDrawer(selectedDrawerId);
    moveAllChildrenToNewDrawer(drawerToBeMoved, selectedDrawerId);
    updateParentDrawerBoolean(selectedDrawerId);
    navigate("/home");
    //navigate(0);
  };

  //+++++++++++++++++++++++++++Preview list --- Selected Drawer+++++++++++++++
  const selectedDestinationDrawer = drawers
    .filter((item) => item._id == sessionStorage.getItem("selectedDrawerId"))
    .map((item) => (
      <h4 className="sort-preview-drawer" key={item._id}>
        {item.name}
      </h4>
    ));

  //+++++++++++++++++++++++++++Construct list with functions in ListConstructionService.jsx+++++++++++++++
  const GatherChildren = () => {
    if (!loadingDrawers) {
      const selectedDrawerObj = drawers.filter(
        (item) => item._id == sessionStorage.getItem("selectedDrawer")
      );
      const renderedChildren = selectedDrawerObj[0]["subDrawer"] ? (
        <>
          {ListConstructionService.findScribbles()}
          {ListConstructionService.findSubDrawers()}
        </>
      ) : (
        <>{ListConstructionService.findScribbles()}</>
      );

      return renderedChildren;
    }
  };

  //+++++++++++++++++++++++++++Finding the name of drawer to be moved for a small display at the top +++++++++++++++
  const drawerToBeMovedObjName = () => {
    const obj = drawers.filter(
      (item) => item._id == sessionStorage.getItem("drawerToBeMoved")
    );
    return obj[0]["name"];
  };

  //+++++++++++++++++++++++++++Finding the name of the destination drawer for a small display at the top +++++++++++++++
  const destinationDrawerObjName = () => {
    const obj = drawers.filter((item) => item._id == selectedDrawerId);
    return obj[0]["name"];
  };

  return (
    <div className="sort-drawer-preview-div">
      <h3 className="sort-drawer-title">
        {sessionStorage.getItem("drawerToBeMoved") &&
          !loadingDrawers &&
          drawerToBeMovedObjName()}
        <Icon icon="mingcute:drawer-line" color="red" />
        <Icon icon="ri:arrow-right-fill" />
        {selectedDrawerId && !loadingDrawers && destinationDrawerObjName()}
        <Icon icon="mingcute:drawer-line" color="red" />
      </h3>

      <div className="drawer-content-result-div">
        <div>{selectedDestinationDrawer}</div>
        <GatherChildren />
      </div>
      <div>
        <OverlayTrigger placement="right" overlay={tooltipMoveHere}>
          <Button onClick={handleMoveHere} variant="dark" className="move-btn">
            <Icon icon="ic:baseline-move-down" width="30" />
          </Button>
        </OverlayTrigger>
      </div>
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
