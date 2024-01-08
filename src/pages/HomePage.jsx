import MyAccordion from "../components/MyAccordion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { Icon } from "@iconify/react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function HomePage({ expandedIndex, handleExpand }) {
  const { user, setUser } = useUserContext();
  const tooltipCreate = <Tooltip id="tooltip">Create New Drawer</Tooltip>;

  useEffect(() => {
    const userInBrowser = JSON.parse(localStorage.getItem("user"));
    if (userInBrowser) {
      setUser(userInBrowser);
    }
  }, []);

  return (
    <div>
      <MyAccordion
        expandedIndex={expandedIndex}
        handleExpand={handleExpand}
        user={user}
      />
      <OverlayTrigger placement="bottom" overlay={tooltipCreate}>
        <Link
          to="/create"
          className="btn btn-dark btn-lg"
          data-testid="createNewDrawer"
        >
          <Icon icon="typcn:plus" />
          <Icon icon="mingcute:drawer-line" color="white" width="30" />
        </Link>
      </OverlayTrigger>
    </div>
  );
}
