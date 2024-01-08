export default {
  logout: () => {
    return fetch("http://127.0.0.1:8080/api/users/logout", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(),
    })
      .then((data) => data.json())
      .catch((error) => console.error(error.message));
  },
};
