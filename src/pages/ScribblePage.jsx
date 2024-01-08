import "../css/ScribblePage.css";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import FileDrop from "../components/FileDrop";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelectedScribbleContext } from "../context/SelectedScribbleContext";
import { useFileContext } from "../context/FileContext";
import { useUserContext } from "../context/UserContext";

export default function ScribblePage() {
  const navigate = useNavigate();
  const [scribbleContent, setScribbleContent] = useState("");
  const [scribbleTitle, setScribbleTitle] = useState("");
  const [tempFiles, setTempFiles] = useState([]);
  const [content, setContent] = useState("Scribble & Screenshot here ..");
  const body = useRef(content);
  const [selectedScribbleId, setSelectedScribbleId] =
    useSelectedScribbleContext();
  const { files, setFiles } = useFileContext();
  const { user } = useUserContext();
  const [baseImage, setBaseImage] = useState("");

  let timerID = useRef(null);

  //++++++++++++++Tooltips+++++++++++++++++++++++++++++++++++++++++++++++++
  const tooltipJustSave = <Tooltip id="tooltip">Just Save</Tooltip>;
  const tooltipSort = <Tooltip id="tooltip">Sort</Tooltip>;

  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  const convertFileToBase64 = (file) => {
    const blob = new Blob([JSON.stringify(file, null, 2)], {
      type: "application/json",
    });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
    };
  };

  /////+++++++++++++++++++++++++++Create a new scribble++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const createNewScribble = () => {
    body.current = document.querySelector(".screenshot").innerHTML;
    setContent(body.current);
    const attachmentBool = files.length < 1 ? false : true;
    //files default extraction include only path and preview so add more info here
    //console.log("files", files);

    let filesInfo = [];
    for (let obj in files) {
      convertFileToBase64(files[obj].preview);

      const perFile = {};
      perFile["path"] = files[obj]["file"].path;
      perFile["name"] = files[obj]["file"].name;
      perFile["preview"] = files[obj].preview;
      perFile["size"] = files[obj]["file"].size;
      perFile["format"] = files[obj]["file"].type;
      filesInfo.push(perFile);
    }

    const contentDetails =
      content != "Scribble & Screenshot here .." ? body.current : "No scribble";

    let dataPost = {
      userId: user._id,
      title: scribbleTitle ? scribbleTitle : "Untitled",
      type: "scribble",
      content: contentDetails,
      stray: true,
      level: 1,
      attachment: attachmentBool,
      files: filesInfo,
    };
    fetch("https://drawer-backend.onrender.com/api/scribbles/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      .then((json) => {
        setSelectedScribbleId(json.data._id);
      })
      .catch((error) => console.error(error.message));
  };

  // const handleScribbleChange = (e) => {
  //   setScribbleContent(e.target.value);
  // };

  const handleTitleChange = (value) => {
    setScribbleTitle(value);
  };

  const handleSubmitScribble = (e) => {
    createNewScribble(e);
    setTempFiles([]);
    setScribbleTitle("");
    setContent("");
    body.current = "";
    navigate("/stray");
    navigate(0);
  };

  //Future Feature - in progress
  const detectContent = () => {
    if (document.querySelector(".screenshot")) {
      document
        .querySelector(".screenshot")
        .addEventListener("input", function (e) {
          let imageArray = [];
          const parent = document.querySelector(".screenshot");
          if (parent.getElementsByTagName("img")) {
            console.log("________________FOUND");
          } else {
            console.log("NOOOOOOOOOOOOOOOOOOOO");
          }
        });
    }
  };

  detectContent();

  return (
    <div className="ScribblePage">
      <InputField
        htmlFor="Title"
        type="text"
        name="scribble-title"
        placeholder="Title"
        value={scribbleTitle}
        id="scribble-title"
        // Change the name - handleNewDrawerChange
        handleNewDrawerChange={handleTitleChange}
      />

      <br />

      <div
        contentEditable="true"
        className="screenshot"
        ref={body}
        suppressContentEditableWarning={true}
        onClick={() => setContent("")}
      >
        {content}
      </div>
      <br />

      <FileDrop
        files={files}
        setFiles={setFiles}
        tempFiles={tempFiles}
        setTempFiles={setTempFiles}
        baseImage={baseImage}
        setBaseImage={setBaseImage}
      />

      <br />

      <div className="buttons-div">
        <OverlayTrigger placement="bottom" overlay={tooltipJustSave}>
          <Button onClick={() => handleSubmitScribble()} variant="dark">
            <Icon icon="ic:round-save-alt" width="24" />
          </Button>
        </OverlayTrigger>
        <span className="or">or</span>
        <OverlayTrigger placement="bottom" overlay={tooltipSort}>
          <Button variant="dark">
            <Icon
              icon="mingcute:drawer-line"
              color="white"
              width="24"
              onClick={() => {
                createNewScribble();
                //Because of the async function above, selectedScribble ID doesn't get updated in time.
                //This is still workaround as the error page still shows up in the halfway.
                timerID = setTimeout(() => {
                  navigate("/sort");
                  navigate(0);
                }, 1000);
              }}
            />
          </Button>
        </OverlayTrigger>
      </div>
      <div>
        {" "}
        <Icon
          className="back-btn"
          icon="icon-park-outline:back"
          color="black"
          width="50"
          onClick={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
