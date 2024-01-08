import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext("");

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    isLoggedIn: false,
  });

  useEffect(() => {
    const userInBrowser = JSON.parse(localStorage.getItem("user"));
    if (userInBrowser) {
      setUser(userInBrowser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => {
  return useContext(UserContext);
};
