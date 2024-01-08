import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/AuthService";

///+++++++++++++++++++This hook will remove all the sessionStorage/localStorage after 10 min of inactivity+++++++++++++++++++++++++++++
export function useTimeout() {
  let timeoutID = useRef(null);
  const navigate = useNavigate();

  const trackInactivity = () => {
    document.addEventListener("mousemove", () => {
      localStorage.setItem("lastActvity", new Date());
    });
    document.addEventListener("click", () => {
      localStorage.setItem("lastActvity", new Date());
    });

    timeoutID = setInterval(() => {
      const lastAcivity = localStorage.getItem("lastActvity");
      const diffMs = Math.abs(new Date(lastAcivity) - new Date()); // milliseconds between now & last activity
      const seconds = Math.floor(diffMs / 1000);
      const minute = Math.floor(seconds / 60);
      //console.log(seconds + " sec and " + minute + " min since last activity");
      if (minute == 10) {
        console.log("No activity from last 10 minutes... Logging Out");
        clearInterval(timeoutID);
        //code for logout
        AuthService.logout().then(() => {
          localStorage.setItem("user", null);
          sessionStorage.setItem("scribblesData", null);
          sessionStorage.setItem("drawersData", null);
          sessionStorage.setItem("selectedDrawer", null);
          sessionStorage.setItem("selectedScribble", null);
          sessionStorage.setItem("toBeMovedDrawer", null);
          sessionStorage.setItem("drawerToBeMoved", null);
          localStorage.setItem("lastActvity", null);
          navigate(0);
        });
      }
    }, 1000);
  };

  useEffect(() => {
    trackInactivity();
    return () => {
      clearInterval(timeoutID);
    };
  }, []);

  return;
}
