import { createContext, useState, useContext, useEffect } from "react";

const SelectedScribbleContext = createContext("");

export const SelectedScribbleProvider = (props) => {
    const [selectedScribbleId, setSelectedScribbleId] = useState("");

    useEffect(() => {
      const selectedScribble = sessionStorage.getItem("selectedScribble");
      if (selectedScribble) {
        setSelectedScribbleId(selectedScribble);
      }
    }, []);
  
    useEffect(() => {
      sessionStorage.setItem("selectedScribble", selectedScribbleId);
    }, [selectedScribbleId]);

  return (
    <SelectedScribbleContext.Provider
      value={[selectedScribbleId, setSelectedScribbleId]}
    >
      {props.children}
    </SelectedScribbleContext.Provider>
  );
};

export const useSelectedScribbleContext = () => {
  return useContext(SelectedScribbleContext);
};
