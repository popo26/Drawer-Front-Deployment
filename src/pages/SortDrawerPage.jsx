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
        ) {
          subDrawersToBeMoved.push(drawers[x]);
          console.log("subDrawersToBeMoved SORTDRAWER", subDrawersToBeMoved);

          let newLevel;

          //////CURRENTLY WORKING ON THIS/////////////////////////////////////////////////////////////////////
          if (drawers[x].drawerId && drawers[x].drawerId === parentDrawerId) {
            const parentDrawer = drawers.filter(
              (item) => item._id == drawers[x].drawerId
            );
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
          //////CURRENTLY WORKING ON THIS/////////////////////////////////////////////////////////////////////

          //console.log("matching subdrawers", drawers[x]);
          let dataPost = {
            rootId: newTopLevelDrawerId,
            root: false,
            level: newLevel,
          };

          fetch(
            `https://drawer-backend.onrender.com/api/drawers/${drawers[x]._id}`,
            {
              method: "PUT",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataPost),
            }
          )
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
        fetch(
          `https://drawer-backend.onrender.com/api/scribbles/${scribbles[x]._id}`,
          {
            method: "PUT",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
          }
        )
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
    fetch(
      `https://drawer-backend.onrender.com/api/drawers/${drawerToBeMoved}`,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPost),
      }
    )
      .then((response) => response.json())
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
        moveDrawerToNewDrawer(json.data._id);
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
      // setTimeout(() => navigate(0), 50);
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
    const obj = drawers.filter(
      (item) => item._id == sessionStorage.getItem("drawerToBeMoved")
    );
    return obj[0]["name"];
  };

  // const destinationDrawerObjName = () => {
  //   const obj = drawers.filter((item) => item._id === selectedDrawerId);
  //   return obj[0]["name"];
  // };

  const destinationDrawer = drawers.find(
    (item) => item._id === selectedDrawerId
  );

  return (
    <div id="page">
      <h4 className="sort-drawer-title">
        {sessionStorage.getItem("drawerToBeMoved") &&
          !loadingDrawers &&
          drawerToBeMovedObjName()}
        <Icon icon="mingcute:drawer-line" color="#EA4C4C" />
        <Icon icon="ri:arrow-right-fill" />

        {/* {selectedDrawerId && !loadingDrawers && destinationDrawerObjName()} */}
        {selectedDrawerId && destinationDrawer?.name}

        <Icon icon="mingcute:drawer-line" color="#EA4C4C" />
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
          className="back-btn move-btn"
        />
      </div>
    </div>
  );
}

// import { useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { Icon } from "@iconify/react";
// import InputField from "../components/InputField";
// import MyButton from "../components/MyButton";
// import MyDropdown from "../components/MyDropdown";
// import "../css/SortPage.css";
// import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { useDataContext } from "../context/DataContext";
// import { useSelectedDrawerContext } from "../context/SelectedDrawerContext";
// import { useDrawerToBeMovedContext } from "../context/DrawerToBeMovedContext";
// import { useDrawerNameContext } from "../context/DrawerNameContext";
// import { useUserContext } from "../context/UserContext";

// export default function SortDrawerPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { drawers, scribbles, loadingDrawers } = useDataContext();
//   const { selectedDrawerId, handleSelectedDrawerId } =
//     useSelectedDrawerContext();
//   const [drawerToBeMoved, setDrawerToBeMoved] = useDrawerToBeMovedContext();
//   const [drawerName, setDrawerName] = useDrawerNameContext();
//   const [newDrawerNameFieldSelected, setNewDrawerNameFieldSelected] =
//     useState(true);
//   const [displayMessage, setDisplayMessage] = useState(
//     "Or move it to existing drawer"
//   );
//   const { user } = useUserContext();

//   //++++++++Tooltip++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   const tooltipNext = <Tooltip id="tooltip">Next</Tooltip>;

//   //+++++++To grab drawerToBeMoved from sessionStorage and set as a state++++++++++++++++++++++++++++++++++++++
//   useEffect(() => {
//     let drawerToBeMovedSession = sessionStorage.getItem("drawerToBeMoved");
//     setDrawerToBeMoved(drawerToBeMovedSession);
//     handleSelectedDrawerId("");
//   }, []);

//   ///NOT WORKING! :-(
//   //++++++++Move children to the new drawer in DB +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   const moveAllChildrenToNewDrawer = (parentDrawerId, newTopLevelDrawerId) => {
//     // parentDrawerId ---> Drawer To Be Moved
//     //newTopLevelDrawerId ---> Newly created root drawer
//     const drawerToBeMovedObject = drawers.filter(
//       (item) => item._id == parentDrawerId
//     );

//     let subDrawersToBeMoved = [];

//     if (drawerToBeMovedObject[0].subDrawer) {
//       for (let x in drawers) {
//         if (
//           drawers[x].drawerId == parentDrawerId ||
//           (drawers[x].rootId == drawerToBeMovedObject[0]["rootId"] &&
//             drawers[x].level > drawerToBeMovedObject[0]["level"])
//         ) {
//           subDrawersToBeMoved.push(drawers[x]);

//           let newLevel;

//           //////WORKING ON THIS/////////////////////////////////////////////////////////////////////
//           if (drawers[x].drawerId && drawers[x].drawerId === parentDrawerId) {
//             const parentDrawer = drawers.filter(
//               (item) => item._id == drawers[x].drawerId
//             );
//             newLevel = drawers[x].level + 1;
//           } else if (
//             drawers[x].drawerId &&
//             drawers[x].drawerId !== parentDrawerId &&
//             drawers[x].rootId === drawerToBeMovedObject[0]["rootId"]
//           ) {
//             newLevel = drawers[x].level + 1;
//           } else {
//             newLevel = 3;
//           }
//           //////WORKING ON THIS/////////////////////////////////////////////////////////////////////

//           let dataPost = {
//             rootId: newTopLevelDrawerId,
//             root: false,
//             level: newLevel,
//           };

//           fetch(
//             `https://drawer-backend.onrender.com/api/drawers/${drawers[x]._id}`,
//             {
//               method: "PUT",
//               mode: "cors",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(dataPost),
//             }
//           )
//             .then((response) => response.json())
//             .catch((error) => console.error(error.message));
//         }
//       }
//     }

//     for (let x in scribbles) {
//       if (scribbles[x].rootDrawerId == parentDrawerId) {
//         let dataPost = {
//           rootDrawerId: newTopLevelDrawerId,
//           stray: false,
//           level: drawerToBeMovedObject[0]["level"] + scribbles[x].level,
//         };
//         fetch(
//           `https://drawer-backend.onrender.com/api/scribbles/${scribbles[x]._id}`,
//           {
//             method: "PUT",
//             mode: "cors",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(dataPost),
//           }
//         )
//           .then((response) => response.json())
//           .catch((error) => console.error(error.message));
//       }
//     }
//   };

//   //++++++++Move selected drawer to the new drawer +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   const moveDrawerToNewDrawer = (passedId) => {
//     let dataPost = {
//       rootId: passedId,
//       drawerId: passedId,
//       root: false,
//       level: 2,
//     };
//     fetch(
//       `https://drawer-backend.onrender.com/api/drawers/${drawerToBeMoved}`,
//       {
//         method: "PUT",
//         mode: "cors",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataPost),
//       }
//     )
//       .then((response) => response.json())
//       .catch((error) => console.error(error.message));
//   };

//   //++++++++Create new drawer in DB +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   const createNewDrawer = () => {
//     let dataPost = {
//       rootId: drawers.length + 1,
//       userId: user._id,
//       name: drawerName.toUpperCase(),
//       type: "drawer",
//       subDrawer: true,
//       root: true,
//       level: 1,
//     };
//     fetch("https://drawer-backend.onrender.com/api/drawers/create", {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(dataPost),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         moveDrawerToNewDrawer(json.data._id);
//         moveAllChildrenToNewDrawer(drawerToBeMoved, json.data._id);
//       })
//       .catch((error) => console.error(error.message));
//   };

//   //+++++++To track new drawer name+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   const handleChange = (value) => {
//     setDrawerName(value);
//   };

//   //++++++++Create new drawer with alert in case of no input+++++++++++++++++++++++++++++++++++++++++++
//   const handleCreate = () => {
//     {
//       !drawerName ? alert("The new drawer name is empty.") : createNewDrawer();
//       setDrawerName("");
//       navigate("/home");
//       //navigate(0);
//       setTimeout(() => navigate(0), 1000);
//     }
//   };

//   //+++++++++To swap display message on the button++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//   const handleDisplay = () => {
//     setNewDrawerNameFieldSelected(!newDrawerNameFieldSelected);
//     {
//       displayMessage == "Or move it to existing drawer"
//         ? setDisplayMessage("Or create new top level drawer")
//         : setDisplayMessage("Or move it to existing drawer");
//     }
//   };

//   //++++++++++To display Source and Destination drawer name at the top of the page++++++++++++++++++++++++
//   const drawerToBeMovedObjName = () => {
//     // if (!loadingDrawers) {
//     //   const obj = drawers.filter(
//     //     (item) => item._id == sessionStorage.getItem("drawerToBeMoved")
//     //   );
//     //   return obj[0]["name"];
//     // }
//     const obj = drawers.filter(
//       (item) => item._id == sessionStorage.getItem("drawerToBeMoved")
//     );
//     return obj[0]["name"];
//   };

//   const destinationDrawerObjName = () => {
//     const obj = drawers.filter((item) => item._id === selectedDrawerId);
//     return obj[0]["name"];
//   };

//   return (
//     <div id="page">
//       <h4 className="sort-drawer-title">
//         {sessionStorage.getItem("drawerToBeMoved") &&
//           !loadingDrawers &&
//           drawerToBeMovedObjName()}
//         <Icon icon="mingcute:drawer-line" color="#EA4C4C" />
//         <Icon icon="ri:arrow-right-fill" />
//         {selectedDrawerId && !loadingDrawers && destinationDrawerObjName()}
//         <Icon icon="mingcute:drawer-line" color="#EA4C4C" />
//       </h4>

//       {newDrawerNameFieldSelected && (
//         <div>
//           <InputField
//             type="text"
//             name="create-new-drawer"
//             id="create-new-drawer"
//             placeholder="Create new TOP-level drawer"
//             value={drawerName}
//             handleNewDrawerChange={handleChange}
//           />
//           <br />
//           <MyButton
//             href={null}
//             btnName={<Icon icon="ic:baseline-move-down" width="30" />}
//             handleNewDrawerCreate={handleCreate}
//             drawerName={drawerName}
//           />
//         </div>
//       )}

//       <Button onClick={handleDisplay} className="sort-msg-btn" variant="dark">
//         {displayMessage}
//       </Button>

//       {!newDrawerNameFieldSelected && (
//         <>
//           <div>
//             <MyDropdown user={user} />
//           </div>
//           <OverlayTrigger placement="right" overlay={tooltipNext}>
//             <Button
//               variant="dark"
//               className="next-btn move-btn2"
//               onClick={(e) => {
//                 e.preventDefault();
//                 let passingData = { selectedDrawerId, drawerToBeMoved };
//                 {
//                   !selectedDrawerId
//                     ? alert("Please select destination drawer")
//                     : navigate("/sort-drawer-preview", { state: passingData });
//                   sessionStorage.setItem("selectedDrawerId", selectedDrawerId);
//                 }
//               }}
//             >
//               <Icon icon="tabler:player-track-next-filled" />
//             </Button>
//           </OverlayTrigger>
//         </>
//       )}

//       <div>
//         <Icon
//           icon="icon-park-outline:back"
//           color="black"
//           width="50"
//           onClick={() => navigate(-1)}
//           className="back-btn move-btn"
//         />
//       </div>
//     </div>
//   );
// }
