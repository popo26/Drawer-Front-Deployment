import "../css/SearchPage.css";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";
import { useUserContext } from "../context/UserContext";

export default function SearchPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  return (
    <div className="SearchPage">
      <Search user={user} />

      <div className="back-btn">
        <Icon
          icon="icon-park-outline:back"
          color="black"
          width="50"
          onClick={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
