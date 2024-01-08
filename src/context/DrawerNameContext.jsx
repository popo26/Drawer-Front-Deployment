import { createContext, useState, useContext } from "react";

const DrawerNameContext = createContext("");

export const DrawerNameProvider = (props) => {
  const [drawerName, setDrawerName] = useState("");

  return (
    <DrawerNameContext.Provider value={[drawerName, setDrawerName]}>
      {props.children}
    </DrawerNameContext.Provider>
  );
};

export const useDrawerNameContext = () => {
  return useContext(DrawerNameContext);
};
