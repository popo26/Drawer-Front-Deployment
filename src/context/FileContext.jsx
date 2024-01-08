import { createContext, useState, useContext, useEffect } from "react";

const FileContext = createContext("");

export const FileProvider = (props) => {
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  useEffect(() => {
    const currentFiles = JSON.parse(sessionStorage.getItem("files"));
    if (currentFiles) {
      setFiles(currentFiles);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  return (
    <FileContext.Provider
      value={{ files, setFiles, loadingFiles, setLoadingFiles }}
    >
      {props.children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  return useContext(FileContext);
};
