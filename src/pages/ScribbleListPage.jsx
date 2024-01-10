import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import "../css/ScribbleListPage.css";
import { useDataContext } from "../context/DataContext";
import { useSelectedScribbleContext } from "../context/SelectedScribbleContext";
import { useFileContext } from "../context/FileContext";
import { useUserContext } from "../context/UserContext";

export default function ScribbleListPage() {
  const navigate = useNavigate();
  const { scribbles } = useDataContext();
  const [selectedScribbleId, setSelectedScribbleId] =
    useSelectedScribbleContext();
  const { user } = useUserContext();

  //+++++++++++++ Delete a scribble in DB+++++++++++++++++++++++++++++++++++
  const deleteScribble = (id) => {
    fetch(`https://drawer-backend.onrender.com/api/scribbles/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message));
  };

  //+++++++++++++ Delete a scribble Alert+++++++++++++++++++++++++++++++++++
  const handleDelete = (id) => {
    const response = confirm(`Are you sure to delete?`);
    if (response == true) {
      deleteScribble(id);
    }
  };

  const renderedList = scribbles.map(
    (item) =>
      item.stray === true &&
      item.userId === user._id && (
        <p key={item._id}>
          <Link
            to={`/scribble/${item._id}`}
            onClick={() => {
              setSelectedScribbleId(item._id);
              sessionStorage.setItem("selectedScribble", item._id);
            }}
          >
            {item.attachment && (
              <Icon
                className="icon5"
                icon="ic:outline-attachment"
                color="orange"
                width="18"
              />
            )}
            <span className="stray-item">{item.title}</span>
          </Link>{" "}
          <a
            onClick={() => {
              handleDelete(item._id);
              navigate(0);
            }}
          >
            <Icon
              className="icon10 move-btn2"
              icon="ion:trash-outline"
              color="black"
              width="24"
            />
          </a>
          <Icon
            className="icon10 move-btn2"
            icon="mingcute:drawer-line"
            color="black"
            width="25"
            onClick={() => {
              setSelectedScribbleId(item._id);
              sessionStorage.setItem("selectedScribble", item._id);
              navigate("/sort", { state: { id: item._id } });
            }}
          />
        </p>
      )
  );

  return (
    <div className="ScribbleListPage">
      <h4>Stray scribbles</h4>
      <div className="stray-list">{renderedList}</div>
      <div>
        {" "}
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
