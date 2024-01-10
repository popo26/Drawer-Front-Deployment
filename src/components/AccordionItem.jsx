import "../css/AccordionItem.css";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function AccordionItem({
  isExpanded,
  handleExpand,
  triangle,
  findSubDrawers,
  findScribbles,
  item,
}) {
  return (
    <>
      <div
        className="AccordionItem"
        key={item._id}
        onClick={() => {
          handleExpand(item._id);
        }}
      >
        <div>
          <div className="accordion-header">
            <h1>
              {item.name} {triangle}
            </h1>
            <div className="drawer-icon move-btn2">
              <Link to={`/drawer-list/${item._id}`}>
                <Icon
                  icon="mingcute:drawer-line"
                  color="black"
                  width="30"
                  height="30"
                />
              </Link>
            </div>
          </div>
        </div>
        <div>
          {isExpanded ? (
            item["subDrawer"] == true ? (
              <div>
                <div className="no-subfolder">{findScribbles(item._id)}</div>
                <div>{findSubDrawers(item._id)}</div>
              </div>
            ) : (
              <div>{findScribbles(item._id)}</div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
