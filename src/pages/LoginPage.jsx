import axios from "axios";
import logo from "../assets/logo_d.png";
import "../css/LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useUserContext } from "../context/UserContext";

export default function LoginPage() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage("");
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();

    axios
      .post("https://drawer-backend.onrender.com/api/users/login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (!response.data.errmsg) {
          //set isLoggedIn for frontend
          setUser({ ...user, isLoggedIn: true });
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log("successful signup");
          navigate("/home");
          navigate(0);
        } else {
          console.log("email already taken");
          setUser({ ...user, isLoggedIn: false });
        }
      })
      .catch((error) => {
        console.log("login error: ");
        console.log(error);
        setMessage("Invalid email or password");
      });
  };

  return (
    <div className="LoginPage">
      <div className="form">
        <div>
          <img src={logo} width="100rem" />
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label hidden>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={user.email}
              name="email"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label hidden>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={user.password}
              name="password"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            {/* <a href="#">Don't remember?</a> */}
          </Form.Group>
          {message && <Alert variant="danger">{message}</Alert>}

          <Button variant="dark" type="submit" onClick={handleClick} className="move-btn2">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}
