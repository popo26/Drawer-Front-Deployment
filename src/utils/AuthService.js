export default {
  logout: () => {
    return fetch("https://drawer-backend.onrender.com/api/users/logout", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(),
    })
      .then((data) => data.json())
      .catch((error) => console.error(error.message));
  },
};
