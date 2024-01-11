import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DataContext = createContext("");

export const DataProvider = (props) => {
  const [drawers, setDrawers] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [loadingScribbles, setLoadingScribbles] = useState(true);
  const [loadingDrawers, setLoadingDrawers] = useState(true);

  const navigate = useNavigate();

  //retrieve data from sessionStorage on mount or refresh
  useEffect(() => {
    const drawersData = JSON.parse(sessionStorage.getItem("drawersData"));
    if (drawersData) {
      setDrawers(drawersData);
    }
  }, []);

  useEffect(() => {
    const scribblesData = JSON.parse(sessionStorage.getItem("scribblesData"));
    if (scribblesData) {
      setScribbles(scribblesData);
    }
  }, []);

  //Fetch data from the server
  useEffect(() => {
    fetch("https://drawer-backend.onrender.com/api/scribbles", {
      method: "GET",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((json) => {
        setLoadingScribbles(false);
        setScribbles(json.data);
      });
  }, []);

  useEffect(() => {
    fetch("https://drawer-backend.onrender.com/api/drawers", {
      method: "GET",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((json) => {
        setLoadingDrawers(false);
        setDrawers(json.data);
      });
  }, []);

  // Local Storage: setting & getting data
  const updateRootId = (drawerId) => {
    const newDrawerObj = drawers.filter((item) => item._id == drawerId);
    let dataPost = {
      rootId: newDrawerObj[0]["_id"],
    };
    fetch(`https://drawer-backend.onrender.com/api/drawers/${drawerId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      .then(() => navigate(0)) //To sync sessionStorage and DB
      .catch((error) => console.error(error.message));
  };

  //Original rootId gets updated to match id for root drawers
  useEffect(() => {
    for (let item in drawers) {
      if (
        drawers[item]["root"] == true &&
        drawers[item]["rootId"] != drawers[item]["_id"]
      ) {
        //console.log("Mismatch", drawers[item]);
        updateRootId(drawers[item]["_id"]);
      }
    }
  }, [drawers, scribbles]);

  useEffect(() => {
    sessionStorage.setItem("drawersData", JSON.stringify(drawers));
  }, [drawers]);

  useEffect(() => {
    sessionStorage.setItem("scribblesData", JSON.stringify(scribbles));
  }, [scribbles]);

  return (
    <DataContext.Provider
      value={{
        drawers,
        scribbles,
        setDrawers,
        setScribbles,
        loadingScribbles,
        setLoadingScribbles,
        loadingDrawers,
        setLoadingDrawers,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
