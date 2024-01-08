import "../css/PerScribblePage.css";
import { Icon } from "@iconify/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDataContext } from "../context/DataContext";
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

export default function PerScribblePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [screenshots, setSecreenshots] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const { scribbles, loadingScribbles } = useDataContext();
  const body = useRef(screenshots);
  const { setFiles, loadingFiles } = useFileContext();

  let target = scribbles.find((item) => item._id == id);

  //Need to have scribble content onload so that decodeHtml function can be used
  useEffect(() => {
    if (!loadingScribbles) {
      setSecreenshots(target.content);

      if (!loadingFiles) {
        const newFiles = JSON.parse(sessionStorage.getItem("files"));
        setFiles(newFiles);
      }

      return () => setSecreenshots([]);
    }
  }, []);

  //+++++++ Navigate to different endpoint depending on scribble stray type +++++++++++++++++
  const scribbleNavigation = (id) => {
    const scribbleToBeDeleted = scribbles.filter((item) => item._id == id);
    scribbleToBeDeleted[0].stray == true
      ? navigate("/stray")
      : navigate("/home");
    navigate(0);
  };

  //+++++++++++++++ Delete a Scribble from DB ++++++++++++++++++++++++++++++++++++++++++++++
  const deleteScribble = (id) => {
    fetch(`http://localhost:8080/api/scribbles/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message));
  };

  //+++++++++++++++ Delete a Scribble - whole process +++++++++++++++++++++++++++++++++++++
  const handleDelete = (id) => {
    const response = confirm(`Are you sure to delete this scribble?`);
    if (response == true) {
      deleteScribble(id);
      scribbleNavigation(id);
    }
  };

  //+++++++++++++++ Delete an attachment from Scribble ++++++++++++++++++++++++++++++++++++
  const handleDeleteAttachment = (e, blob) => {
    e.stopPropagation();
    const selectedAttachments = scribbles.find((item) => item._id === id).files;
    let newFilesArray = [];
    for (let scribble of scribbles) {
      if (scribble.files.length > 0) {
        for (let item of selectedAttachments) {
          if (item.preview === blob) {
            newFilesArray = selectedAttachments.filter(
              (file) => file._id !== item._id
            );
            let dataPost = {};
            newFilesArray.length === 0
              ? (dataPost = {
                  files: newFilesArray,
                  attachment: false,
                })
              : (dataPost = {
                  files: newFilesArray,
                });
            fetch(`http://localhost:8080/api/scribbles/${id}`, {
              method: "PUT",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataPost),
            })
              .then((response) => response.json())
              .catch((error) => console.error(error.message));
          }
        }
      }
    }
  };

  //+++++++++++++++ Set Editable state to True for Scribble Content +++++++++++++++++++++++++
  const handleEdit = () => {
    setIsEditable(true);
  };

  //+++++++++++++++ Attachment file thumbnails +++++++++++++++++++++++++++++++++++++++++++++
  const thumbs = () => {
    return scribbles
      .find((item) => item._id == id)
      .files.map((file) => (
        <div style={thumb} key={file.preview}>
          <div style={thumbInner}>
            <img src={file.preview} style={img} />
          </div>
          <div className="remove-div">
            <button
              className="remove-btn"
              onClick={(e) => {
                handleDeleteAttachment(e, file.preview);
                scribbleNavigation(id);
              }}
            >
              X
            </button>
          </div>
        </div>
      ));
  };

  //+++++++++++++++ Update Scribble Content +++++++++++++++++++++++++++++++++++++++++++++++
  const updateContent = () => {
    const newContent = body.current.innerHTML;
    setSecreenshots(newContent);

    let dataPost = {
      content: newContent,
      files: target.files,
    };
    fetch(`http://localhost:8080/api/scribbles/${id}`, {
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

  //+++++++++++++++ Update Scribble Content - whole process ++++++++++++++++++++++++++++++
  const update = () => {
    updateContent();
    setIsEditable(false);
    //workaround to update state. On refresh, content gets hidden
    scribbleNavigation(id);
  };

  const htmlStr = target?.content || "";

  function decodeHtml(html) {
    if (document.getElementById("content")) {
      var txt = document.getElementById("content");
      txt.innerHTML = html;
      return txt.value;
    }
  }

  const decodedHTML = decodeHtml(htmlStr);

  if (loadingScribbles) {
    return <div>Loading...</div>;
  }
  return (
    <div className="PerScribblePage">
      <div>
        <h2>{target.title}</h2>

        <section
          id="content"
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          ref={body}
        >
          {decodedHTML}
        </section>

        {target.attachment && <aside style={thumbsContainer}>{thumbs()}</aside>}

        <br />
        <div style={{ margin: "20px " }}>
          {target.attachment && (
            <img
              src={JSON.parse(sessionStorage.getItem("image"))}
              width="100px"
            />
          )}
        </div>
      </div>
      <div>
        <Icon
          className="icon5"
          icon="icon-park-outline:back"
          color="black"
          width="30"
          onClick={() => navigate(-1)}
        />
        {!isEditable ? (
          <Icon
            icon="uiw:edit"
            className="icon5"
            color="black"
            width="30"
            onClick={handleEdit}
          />
        ) : (
          <Icon
            className="icon5"
            icon="material-symbols:update"
            color="red"
            width="30"
            onClick={update}
          />
        )}

        <Icon
          className="icon5"
          icon="ion:trash-outline"
          color="black"
          width="30"
          onClick={() => handleDelete(target._id)}
        />

        <Icon
          className="icon5"
          icon="mingcute:drawer-line"
          color="black"
          width="30"
          height="30"
          onClick={() => navigate("/sort", { state: { id: id } })}
        />
        {/* <FileDrop files={files} setFiles={setFiles} /> */}
      </div>
    </div>
  );
}
