import { createContext, useState, useContext, useEffect } from "react";

const SelectedDrawerContext = createContext("");

export const SelectedDrawerProvider = (props) => {
  const [selectedDrawerId, setSelectedDrawerId] = useState("");
  const handleSelectedDrawerId = (id) => {
    setSelectedDrawerId(id);
  };

  useEffect(() => {
    const selectedDrawer = sessionStorage.getItem("selectedDrawer");
    if (selectedDrawer) {
      setSelectedDrawerId(selectedDrawer);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("selectedDrawer", selectedDrawerId);
  }, [selectedDrawerId]);

  return (
    <SelectedDrawerContext.Provider
      value={{ selectedDrawerId, handleSelectedDrawerId }}
    >
      {props.children}
    </SelectedDrawerContext.Provider>
  );
};

export const useSelectedDrawerContext = () => {
  return useContext(SelectedDrawerContext);
};
