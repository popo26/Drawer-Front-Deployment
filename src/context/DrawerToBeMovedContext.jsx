import { createContext, useState, useContext, useEffect } from "react";

const DrawerToBeMovedContext = createContext("");

export const DrawerToBeMovedContextProvider = (props) => {
    const [drawerToBeMoved, setDrawerToBeMoved] = useState("");

    useEffect(() => {
      const toBeMovedDrawer = sessionStorage.getItem("toBeMovedDrawer");
      if (toBeMovedDrawer) {
        setDrawerToBeMoved(drawerToBeMoved);
      }
    }, []);
  
    useEffect(() => {
      sessionStorage.setItem("toBeMovedDrawer", drawerToBeMoved);
    }, [drawerToBeMoved]);

  return (
    <DrawerToBeMovedContext.Provider
      value={[drawerToBeMoved, setDrawerToBeMoved]}
    >
      {props.children}
    </DrawerToBeMovedContext.Provider>
  );
};

export const useDrawerToBeMovedContext = () => {
  return useContext(DrawerToBeMovedContext);
};
