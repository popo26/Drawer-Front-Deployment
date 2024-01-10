import "../css/ScribbleBtn.css";
import { Icon } from "@iconify/react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ScribbleBtn() {
  //++++++++++Tooltip++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const tooltipScribble = <Tooltip id="tooltip">New Scribble</Tooltip>;

  return (
    <div className="ScribbleBtn-div">
      <OverlayTrigger placement="right" overlay={tooltipScribble}>
        <button className="ScribbleBtn move-btn2">
          <Icon icon="tabler:scribble" width="60px" />
        </button>
      </OverlayTrigger>
    </div>
  );
}
