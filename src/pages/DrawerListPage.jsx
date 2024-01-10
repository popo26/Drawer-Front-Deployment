import "../css/DrawerListPage.css";
import { Icon } from "@iconify/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useDataContext } from "../context/DataContext";
import { useSelectedDrawerContext } from "../context/SelectedDrawerContext";
import { useDrawerToBeMovedContext } from "../context/DrawerToBeMovedContext";
import { useUserContext } from "../context/UserContext";

// export default function DrawerListPage({ expandedIndex }) {
export default function DrawerListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drawerNameToEdit, setDrawerNameToEdit] = useState("");
  const [drawerIdToEdit, setDrawerIdToEdit] = useState("");
  const [updateIconIndex, setUpdateIconIndex] = useState(-1);
  const { drawers, scribbles } = useDataContext();
  const { selectedDrawerId } = useSelectedDrawerContext();
  const [drawerToBeMoved, setDrawerToBeMoved] = useDrawerToBeMovedContext();
  const text = useRef(drawerNameToEdit);
  const { user } = useUserContext();

  // ++++++++Delete Drawer and its sub-drawers and scribbles
  const deleteScribbles = (drawerId) => {
    const associatedScribbles = scribbles.filter(
      (scrb) => scrb.drawerId == drawerId
    );
    for (let t of associatedScribbles) {
      fetch(`https://drawer-backend.onrender.com/api/scribbles/${t._id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .catch((error) => console.error(error.message));
    }
  };

  const deleteSelectedDrawer = (id) => {
    fetch(`https://drawer-backend.onrender.com/api/drawers/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message))
      .then(deleteSubDrawers(id));
  };

  const deleteSubDrawers = (id) => {
    for (let drawerObj of drawers) {
      if (drawerObj.root === true) {
        //delete all rootId
        const sameRootIdDrawers = drawers.filter((item) => item.rootId == id);
        for (let sameRootIdDrawerObj of sameRootIdDrawers) {
          fetch(
            `https://drawer-backend.onrender.com/api/drawers/${sameRootIdDrawerObj._id}`,
            {
              method: "DELETE",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => response.json())
            .catch((error) => console.error(error.message));
          deleteScribbles(sameRootIdDrawerObj._id);
        }
      } else if (drawerObj.root === false && drawerObj["subDrawer"] === true) {
        //delete all subdrawers whose drawerId is id
        const subDrawers = drawers.filter((item) => item.drawerId == id);
        for (let subDrawerObj of subDrawers) {
          fetch(
            `https://drawer-backend.onrender.com/api/drawers/${subDrawerObj._id}`,
            {
              method: "DELETE",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => response.json())
            .catch((error) => console.error(error.message));
          deleteScribbles(subDrawerObj._id);
        }
      }
    }
  };

  //+++++++++Delete Drawer and its content - whole process+++++++++++++++++++++++++++++++++++
  const handleDelete = (id) => {
    const response = confirm(
      `Are you sure to delete this drawer and all the content?`
    );
    if (response == true) {
      deleteSelectedDrawer(id);
      navigate("/home");
      navigate(0);
    }
  };

  //+++++++++Display Update icon when Drawer Name is clicked for editing+++++++++++++++++++++++++++++++++++
  const showUpdateIcon = (id) => {
    const isEditing = id == updateIconIndex;
    if (isEditing) {
      return (
        <Icon
          className="icon10"
          icon="material-symbols:update"
          color="red"
          width="26"
          onClick={update}
        />
      );
    }
  };

  //+++++++++Detect which drawer name is clicked and display update icon+++++++++++++++++++++++++++++++++++
  const handleUpdateIcon = (passedIndex) => {
    setUpdateIconIndex((currentExpandedIndex) => {
      if (currentExpandedIndex == passedIndex) {
        return -1;
      } else {
        return passedIndex;
      }
    });
  };

  //+++++++++Detect which drawer name is clicked for editing+++++++++++++++++++++++++++++++++++
  const detectClickedInnerText = (id) => {
    document
      .getElementById(`targetDrawerId${id}`)
      .addEventListener("input", function () {
        setDrawerNameToEdit(
          document.getElementById(`targetDrawerId${id}`).innerText
        );
      });
  };

  //+++++++++State changes upon drawer name is clicked for editing++++++++++++++++++++++++++++++
  const handleSelectedDrawer = (clickedId) => {
    handleUpdateIcon(clickedId);
    setUpdateIconIndex(clickedId);
    detectClickedInnerText(clickedId);
    const drawerName = drawers.filter((item) => item._id == clickedId);
    setDrawerNameToEdit(drawerName["name"]);
    setDrawerIdToEdit(clickedId);

    text.current = document.getElementById(
      `targetDrawerId${clickedId}`
    ).innerText;
  };

  //+++++++++Update drawer name, remove Update icon, and refresh+++++++++++++++++++++++++++++++++
  const update = () => {
    updateDrawerName(drawerIdToEdit);
    setUpdateIconIndex(-1);
    navigate(0);
  };

  // ++++++++++++++ Find Scribbles +++++++++++++++++++++++++++++++++++++++++++++
  const findScribbles = (id) => {
    let scribbleArray = [];
    for (let item in scribbles) {
      if (scribbles[item].drawerId == id) {
        scribbleArray.push(scribbles[item]);
      }
    }
    return scribbleArray.map((item) => (
      <Link key={item._id} to={`/scribble/${item._id}`}>
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
      const scribbleList = findScribbles(item._id);
      return (
        <div key={item._id} className="sub-drawer-header">
          <div className="sub-drawer-header-div">
            <h3
              id={`targetDrawerId${item._id}`}
              style={{ display: "inline-block" }}
              className={"sub-drawer indent-" + item.level}
              onClick={() => {
                handleSelectedDrawer(item._id);
              }}
              contentEditable="true"
              suppressContentEditableWarning={true}
              ref={text}
            >
              {item.name}
            </h3>
            <Icon
              onClick={() => handleDelete(item._id)}
              icon="ion:trash-outline"
              color="black"
              width="22"
              className="icon10 move-btn2"
            />
            <Icon
              className="icon10 move-btn2"
              icon="mingcute:drawer-line"
              color="black"
              width="22"
              onClick={() => {
                let passingData = { selectedDrawerId, drawerToBeMoved };
                navigate("/sort-drawer", { state: passingData });
                sessionStorage.setItem("drawerToBeMoved", item._id);
              }}
            />
            {showUpdateIcon(item._id)}
          </div>
          {scribbleList.length === 0 ? (
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
      );
    });
  };

  ///////++++++++Update Drawer Name in DB+++++++++++++
  const updateDrawerName = (id) => {
    setDrawerNameToEdit(text.current.innerText);

    let dataPost = {
      name: drawerNameToEdit.toUpperCase(),
    };
    fetch(`https://drawer-backend.onrender.com/api/drawers/${id}`, {
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

  //+++++++++Whole tree view of this drawer+++++++++++++++++++++++++++++++++++
  const renderedList = drawers.map((item) => {
    if (id == item._id && item.userId === user._id) {
      return (
        <div key={item._id}>
          <div className="rendered-drawers">
            <h2
              id={`targetDrawerId${item._id}`}
              style={{ display: "inline-block" }}
              onClick={() => {
                handleSelectedDrawer(item._id);
              }}
              contentEditable="true"
              suppressContentEditableWarning={true}
              ref={text}
            >
              {item.name}
            </h2>
            <Icon
              onClick={() => handleDelete(item._id)}
              icon="ion:trash-outline"
              color="black"
              width="26"
              className="icon10 move-btn2"
            />
            <Icon
              className="icon10 move-btn2"
              icon="mingcute:drawer-line"
              color="black"
              width="26"
              onClick={() => {
                setDrawerToBeMoved(item._id);
                let passingData = { selectedDrawerId, drawerToBeMoved };
                navigate("/sort-drawer", { state: passingData });
                sessionStorage.setItem("drawerToBeMoved", item._id);
                navigate(0);
              }}
            />

            {showUpdateIcon(item._id)}
          </div>

          {item["subDrawer"] === true ? (
            <div>
              <div className="no-subfolder">{findScribbles(item._id)}</div>
              <div>{findSubDrawers(item._id)} </div>
            </div>
          ) : (
            <div>{findScribbles(item._id)}</div>
          )}
        </div>
      );
    }
  });

  return (
    <div>
      <div className="drawer-list">{renderedList}</div>
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
