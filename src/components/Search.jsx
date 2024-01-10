import "../css/SearchPage.css";
import { Icon } from "@iconify/react";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDataContext } from "../context/DataContext";
import { useUserContext } from "../context/UserContext";

export default function Search() {
  const [searchItem, setSearchItem] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { scribbles, drawers } = useDataContext();
  const { user } = useUserContext();

  ///++++++++++++++++++++++Search function++++++++++++++++++++++++++++++++++++++
  const searchKeywordInDb = () => {
    let searchResultArray = [];
    //Search results in scribbles
    for (let item in scribbles) {
      if (
        (scribbles[item]["userId"] === user._id &&
          scribbles[item]["title"]
            .toLowerCase()
            .includes(searchItem.toLowerCase())) ||
        (scribbles[item]["userId"] === user._id &&
          scribbles[item]["content"]
            .toLowerCase()
            .includes(searchItem.toLowerCase()))
      ) {
        searchResultArray.push(scribbles[item]);
      }
    }
    //Search results in drawers
    for (let item in drawers) {
      if (
        drawers[item]["userId"] === user._id &&
        drawers[item]["name"].toLowerCase().includes(searchItem.toLowerCase())
      ) {
        searchResultArray.push(drawers[item]);
      }
    }
    return searchResultArray;
  };

  // ///++++++++++++++++++++++Create search result list++++++++++++++++++++++++++++++++++++++
  const createSearchResultList = (resultList) => {
    let results = [];
    for (let obj of resultList) {
      if (obj.type === "scribble") {
        results.push(
          <Link to={`/scribble/${obj._id}`} key={obj._id}>
            <p>
              {obj.title} <Icon icon="tabler:scribble" color="#EA4C4C" />
            </p>
          </Link>
        );
      } else if (obj.type === "drawer") {
        results.push(
          <Link to={`/drawer-list/${obj.rootId}`} key={obj._id}>
            <p>
              {obj.name} <Icon icon="mingcute:drawer-line" color="#EA4C4C" />
            </p>
          </Link>
        );
      }
    }
    return results;
  };

  //++++++++++++++++++++++++++Get the result and set it as state+++++++++++++++++
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = searchKeywordInDb();
    setSearchResult(result);
  };

  //++++++++++++++++++++++++Track search keyword as state+++++++++++++++++++++++
  const handleChange = (e) => {
    setSearchItem(e.target.value);
  };

  return (
    <div className="Search">
      <div className="">
        <form>
          <input
            className="search-input"
            onChange={handleChange}
            name="search"
            id="search"
            value={searchItem}
            placeholder="Enter keyword.."
          />
          <Button variant="dark" onClick={handleSubmit} className="move-btn2">
            <Icon icon="bi:search" color="white" width="30" height="30" />
          </Button>
        </form>

        <div className="search-result-div">
          {searchResult.length !== 0 ? (
            createSearchResultList(searchResult)
          ) : (
            <p>No Result.</p>
          )}
        </div>
      </div>
    </div>
  );
}
