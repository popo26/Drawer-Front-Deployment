import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

//Apply color in css in progress
export default function MyButton({
  btnName,
  href,
  color,
  drawerName,
  handleNewDrawerCreate,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    handleNewDrawerCreate(drawerName);
  };

  //+++++++++++++++++++++Tooltip++++++++++++++++++++++++++++++++++++++++++++++++++++
  const tooltipCreateAndSave = <Tooltip id="tooltip">Create & Save</Tooltip>;

  return (
    <>
      <OverlayTrigger placement="right" overlay={tooltipCreateAndSave}>
        <Link to={href}>
          <Button variant="dark" onClick={handleClick}>
            {" "}
            {btnName}
          </Button>{" "}
        </Link>
      </OverlayTrigger>
    </>
  );
}
