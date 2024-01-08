import "../css/FileDrop.css";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { useFileContext } from "../context/FileContext";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

function FileDrop({ tempFiles, setTempFiles, baseImage, setBaseImage }) {
  const { files, setFiles, loadingFiles } = useFileContext();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      //   "image/*": ["png", "jpg"],
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        //console.log("URL", URL.createObjectURL(file));
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });
      let newTempFilesState = [...tempFiles.concat(newFiles)];
      let newFilesState = [...tempFiles.concat(newFiles)];

      setTempFiles(newTempFilesState);
      setFiles(newFilesState);
    },
  });

  const handleDelete = (e, blob) => {
    e.stopPropagation();
    const newFiles = files.filter((item) => item.preview != blob);
    setFiles(newFiles);
    setTempFiles(newFiles);
  };

  //tempFiles so that after added to DB it disappear from attachment field. files for throughout App
  const thumbs = tempFiles.map((file) => (
    <div style={thumb} key={file.preview}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
      <div className="remove-div">
        <button
          className="remove-btn"
          onClick={(e) => handleDelete(e, file.preview)}
        >
          X
        </button>
      </div>
    </div>
  ));

  const uploadImage = async (e) => {
    console.log(e.target.files);
    const files = e.target.files[0];
    const base64 = await convertBase64(files);
    setBaseImage(base64);
    sessionStorage.setItem("image", JSON.stringify(base64));
    return base64;
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })} className="baseStyle">
        <input {...getInputProps()} />
        <Icon
          icon="ic:outline-attachment"
          color="rgb(192,192,192,0.6)"
          width="40"
        />
        <aside style={thumbsContainer}>{thumbs}</aside>
      </div>

      {/* Keep it as alternative */}
      {/* <div style={{ marginTop: "30px" }}>
        <input type="file" onChange={(e) => uploadImage(e)}></input>
        <img src={baseImage} width="100px" />
      </div> */}
    </section>
  );
}

export default FileDrop;
