import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  Button,
  Form,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import "../css/ProfilePage.css";
import { useUserContext } from "../context/UserContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const tooltipUpdate = <Tooltip id="tooltip">Click To Update</Tooltip>;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //++++++++++++++++++++ Change username or email ++++++++++++++++++++++++++++++++++++++++++++++++
  const handleClick = (e) => {
    e.preventDefault();

    axios
      .put(`https://drawer-backend.onrender.com/api/users/update/${user._id}`, {
        email: user.email,
        password: user.password,
        username: user.username,
      })
      .then((response) => {
        if (!response.data.errmsg) {
          //set isLoggedIn for frontend

          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .catch((error) => {
        console.log("Update error: ");
        console.log(error);
      });
  };

  //++++++++++++++++++++ Change password ++++++++++++++++++++++++++++++++++++++++++++++++
  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Change Password clicked");

    axios
      .put(
        `https://drawer-backend.onrender.com/api/users/changepassword/${user._id}`,
        {
          _id: user._id,
          email: user.email,
          password: user.password,
          username: user.username,
        }
      )
      .then((response) => {
        //console.log(response);
        if (!response.data.errmsg) {
          ////set isLoggedIn for frontend
          //console.log("Update response", response.data);
          //console.log("password UPDATED", user);
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .catch((error) => {
        console.log("Update error: ");
        console.log(error);
      });
  };

  return (
    <div className="ProfilePage">
      <Form>
        <Form.Group
          as={Row}
          className="mb-3 username-form"
          controlId="formHorizontalUsername"
        >
          <Form.Label column sm={2} className="profile-label">
            Username
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="username"
              placeholder={user.username}
              name="username"
              onChange={handleChange}
              value={user.username}
            />
          </Col>

          <Col sm={2}>
            <OverlayTrigger placement="right" overlay={tooltipUpdate}>
              <Button
                variant="dark"
                type="submit"
                onClick={handleClick}
                className="modify-btn"
              >
                <Icon
                  icon="material-symbols:change-circle-outline"
                  width="30"
                />
              </Button>
            </OverlayTrigger>
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3 email-form"
          controlId="formHorizontalEmail"
        >
          <Form.Label column sm={2} className="profile-label">
            Email
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="email"
              placeholder={user.email}
              name="email"
              onChange={handleChange}
              value={user.email}
            />
          </Col>
          <Col sm={2}>
            <OverlayTrigger placement="right" overlay={tooltipUpdate}>
              <Button
                variant="dark"
                type="submit"
                onClick={handleClick}
                className="modify-btn"
              >
                <Icon
                  icon="material-symbols:change-circle-outline"
                  width="30"
                />
              </Button>
            </OverlayTrigger>
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3 password-form"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={2} className="profile-label">
            Password
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="password"
              placeholder="**********"
              name="password"
              onChange={handleChange}
              value={user.password}
            />
          </Col>
          <Col sm={2}>
            <OverlayTrigger placement="right" overlay={tooltipUpdate}>
              <Button
                variant="dark"
                type="submit"
                onClick={handlePasswordChange}
                className="modify-btn"
              >
                <Icon
                  icon="material-symbols:change-circle-outline"
                  width="30"
                />
              </Button>
            </OverlayTrigger>
          </Col>
        </Form.Group>
      </Form>

      <br />
      <div>
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
