import { Icon } from "@iconify/react";
import InputField from "../components/InputField";
import MyButton from "../components/MyButton";
import "../css/CreateDrawerPage.css";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../context/DataContext";
import { useDrawerNameContext } from "../context/DrawerNameContext";
import { useUserContext } from "../context/UserContext";

export default function CreateDrawerPage() {
  const navigate = useNavigate();
  const { drawers, setDrawers, loadingDrawers } = useDataContext();
  const [drawerName, setDrawerName] = useDrawerNameContext();
  const { user } = useUserContext();

  //+++++++++Create New Drawer in DB+++++++++++++++++
  const createNewDrawer = () => {
    let dataPost = {
      rootId: drawers.length + 1,
      userId: user._id,
      name: drawerName.toUpperCase(),
      type: "drawer",
      subDrawer: false,
      root: true,
      level: 1,
    };
    fetch("https://drawer-backend.onrender.com/api/drawers/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => response.json())
      .then((json) => {
        !loadingDrawers && setDrawers((prevItems) => [...prevItems, json.data]);
      })
      .catch((error) => console.error(error.message));
  };

  //+++++++++Track Drawer Name Change++++++++++++++
  const handleChange = (value) => {
    setDrawerName(value);
  };

  //+++++++++Create new drawer - whole process+++++++++++
  const handleCreate = () => {
    {
      !drawerName ? alert("The new drawer name is empty.") : createNewDrawer();
      setDrawerName("");
      navigate("/home");
      //navigate(0);
    }
  };

  return (
    <div className="CreateDrawerPage">
      <form>
        <InputField
          htmlFor="new-drawer"
          name="new-drawer"
          id="new-drawer"
          placeholder="New Drawer Name"
          type="text"
          value={drawerName}
          handleNewDrawerChange={handleChange}
        />
        <br />
        <MyButton
          href={null}
          btnName={<Icon icon="typcn:plus" />}
          handleNewDrawerCreate={handleCreate}
          drawerName={drawerName}
        />
        <br />
      </form>

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
