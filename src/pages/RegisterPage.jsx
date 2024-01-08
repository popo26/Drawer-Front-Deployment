import axios from "axios";
import logo from "../assets/logo_d.png";
import "../css/RegisterPage.css";
import { useState, useRef, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    username: "",
    role: "user", //admin can only be created via postman
    isLoggedIn: false,
  });
  let timerID = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  //++++++++++++++For redirection to Login page++++++++++++++++++++++++++++++++++++++++
  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  //++++++++++++++Reset Error Message Once User starts typing++++++++++++++++++++++++
  const handleChange = (e) => {
    setMessage("");
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  //++++++++++++++Reset Register Form++++++++++++++++++++++++++++++++++++++++++++++++
  const resetForm = () => {
    setUserForm({
      username: "",
      password: "",
      email: "",
    });
  };

  //++++++++++++++Submit Register Form++++++++++++++++++++++++++++++++++++++++++++++++
  const handleSubmitRegister = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8080/api/users/register", {
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        role: "user",
        isLoggedIn: false,
      })
      .then((response) => {
        console.log(response);
        if (!response.data.errmsg) {
          console.log("successful signup");
          resetForm();
          timerID = setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          console.log("username already taken1");
          setMessage("That email address is taken1.");
        }
      })
      .catch((error) => {
        console.log("That email address is taken.");
        console.log(error);
        setMessage("That email address is taken.");
      });
  };

  return (
    <div className="RegisterPage">
      <div className="form">
        <div>
          <img src={logo} width="100rem" />
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label hidden>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username (1-50 characters)"
              value={userForm.username}
              name="username"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label hidden>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email (6-50 characters)"
              value={userForm.email}
              name="email"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label hidden>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={userForm.password}
              name="password"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="formBasicCheckbox"
          ></Form.Group>
          {message && <Alert variant="danger">{message}</Alert>}
          <Button variant="dark" type="submit" onClick={handleSubmitRegister}>
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}
