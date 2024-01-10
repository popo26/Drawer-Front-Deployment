//////////////////WITH AUTHENTICATION//////////////////////////////////////////////////////////
import "../css/Navbar.css";
import logo from "../assets/logo_d1.png";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Tooltip, OverlayTrigger, Badge } from "react-bootstrap";
import { useDataContext } from "../context/DataContext";
import { useUserContext } from "../context/UserContext";
import AuthService from "../utils/AuthService";

export default function MyNavbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { scribbles } = useDataContext();
  const navigate = useNavigate();
  const [currentStrayScribblesNum, setCurrentStrayScribblesNum] = useState(0);
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const scribblesObjs = scribbles.filter(
        (item) => item.userId === user._id && item.stray === true
      );
      setCurrentStrayScribblesNum(scribblesObjs.length);
    }
  }, [scribbles]);

  //++++++++++++++++++++++++++Logout++++++++++++++++++++++++++++++++++++++++++++

  const handleLogout = () => {
    AuthService.logout()
      .then(() => {
        setUser({
          ...user,
          _id: "",
          username: "",
          email: "",
          password: "",
          role: "",
          isLoggedIn: false,
        });
        localStorage.setItem("user", null);
        sessionStorage.setItem("scribblesData", null);
        sessionStorage.setItem("drawersData", null);
        sessionStorage.setItem("selectedDrawer", null);
        sessionStorage.setItem("selectedScribble", null);
        sessionStorage.setItem("toBeMovedDrawer", null);
        sessionStorage.setItem("drawerToBeMoved", null);
        navigate("/");
        setIsExpanded(false);
      })
      .catch((error) => console.error(error.message));
  };

  //+++++++++++++++++++NavBar when user has not logged in++++++++++++++++++++++++++++
  const unauthenticatedNavBar = () => {
    const tooltipLogin = <Tooltip id="tooltip">Login</Tooltip>;
    const tooltipRegister = <Tooltip id="tooltip">Register</Tooltip>;

    return (
      <>
        <Container>
          <Navbar.Brand href="#home">
            <NavLink className="navbar-brand" to="/">
              <Icon icon="mingcute:drawer-line" color="black" width="50" className="move-btn2"/>
            </NavLink>
          </Navbar.Brand>

          <Nav className="me-auto"></Nav>
          <Nav
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
              gap: "10px",
            }}
          >
            <Nav.Link>
              <NavLink className="nav-link" to="/login">
                <OverlayTrigger placement="bottom" overlay={tooltipLogin}>
                  <Icon icon="clarity:login-solid" color="black" width="30" className="move-btn2"/>
                </OverlayTrigger>
              </NavLink>
            </Nav.Link>
            <Nav.Link>
              <NavLink className="nav-link" to="/register">
                <OverlayTrigger placement="bottom" overlay={tooltipRegister}>
                  <Icon icon="mdi:register" color="black" width="30" className="move-btn2"/>
                </OverlayTrigger>
              </NavLink>
            </Nav.Link>
          </Nav>
        </Container>
      </>
    );
  };

  //+++++++++++++++++++++++++++++++++++++NavBar when user has logged in++++++++++++++++++++++++++++++++++++++++++++++++
  const authenticatedNavBar = () => {
    const tooltipSearch = <Tooltip id="tooltip">Search</Tooltip>;
    const tooltipProfile = <Tooltip id="tooltip">Profile</Tooltip>;
    const tooltipScribbles = <Tooltip id="tooltip">Stray Scribbles</Tooltip>;
    const tooltipLogout = <Tooltip id="tooltip">Logout</Tooltip>;

    return (
      <>
        <Container>
          <Navbar.Brand href="#home">
            <NavLink className="navbar-brand" to="/home">
              <img
                src={logo}
                alt="logo"
                width="36rem"
                onClick={() => setIsExpanded(false)}
                className="move-btn2"
              />
            </NavLink>
          </Navbar.Brand>
          <span className="greeting">Hi {user.username}!</span>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "right",
                gap: "10px",
              }}
            >
              <Nav.Link>
                <NavLink
                  className="nav-link"
                  to="/search"
                  onClick={() => setIsExpanded(false)}
                >
                  <OverlayTrigger placement="bottom" overlay={tooltipSearch}>
                    <Icon
                      icon="bi:search"
                      color="black"
                      width="30"
                      height="30"
                      className="move-btn2"
                    />
                  </OverlayTrigger>
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  className="nav-link"
                  to="/profile"
                  onClick={() => setIsExpanded(false)}
                >
                  <OverlayTrigger placement="bottom" overlay={tooltipProfile}>
                    <Icon
                      icon="healthicons:ui-user-profile"
                      color="black"
                      width="30"
                      height="30"
                      className="move-btn2"

                    />
                  </OverlayTrigger>
                </NavLink>
              </Nav.Link>
              <Nav.Link eventKey={2}>
                <NavLink
                  className="nav-link"
                  to="/stray"
                  onClick={() => setIsExpanded(false)}
                >
                  <OverlayTrigger placement="bottom" overlay={tooltipScribbles}>
                    <a>
                      <Icon
                        icon="game-icons:files"
                        color="black"
                        width="30"
                        height="30"
                        className="move-btn2"

                      />
                      {currentStrayScribblesNum > 0 && (
                        <Badge bg="danger">{currentStrayScribblesNum}</Badge>
                      )}
                    </a>
                  </OverlayTrigger>
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  className="nav-link"
                  color="black"
                  onClick={handleLogout}
                >
                  <OverlayTrigger placement="bottom" overlay={tooltipLogout}>
                    <Icon
                      icon="clarity:logout-solid"
                      color="black"
                      width="30"
                      className="move-btn2"

                    />
                  </OverlayTrigger>
                </NavLink>
              </Nav.Link>
              {user.role === "admin" ? (
                // <Nav.Link>
                <NavLink
                  className="nav-link"
                  to="/admin"
                  onClick={() => setIsExpanded(false)}
                >
                  Admin
                </NavLink>
              ) : // </Nav.Link>
              null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </>
    );
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary Navbar"
      expanded={isExpanded}
    >
      {!user.isLoggedIn ? unauthenticatedNavBar() : authenticatedNavBar()}
    </Navbar>
  );
}
