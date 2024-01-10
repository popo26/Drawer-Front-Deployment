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
  const { scribbles } = useDataContext();
  const { user } = useUserContext();

  ///++++++++++++++++++++++Search function++++++++++++++++++++++++++++++++++++++
  const searchKeywordInDb = () => {
    let searchResultArray = [];
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
    return searchResultArray;
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
          {searchResult.length != 0 ? (
            searchResult.map((item) => {
              return (
                <Link to={`/scribble/${item._id}`} key={item._id}>
                  <p>{item.title}</p>
                </Link>
              );
            })
          ) : (
            <p>No Result.</p>
          )}
        </div>
      </div>
    </div>
  );
}
