const init = () => {
  if (checkIfUserIsLoggedIn()) {
    window.location.href = "employees.html";
  }

  document.querySelector("#btn-submit").addEventListener("click", login);
};

const login = async () => {
  const user_mail = document.getElementById("input-mail").value;
  const user_password = document.getElementById("input-password").value;

  console.log({ user_mail, user_password });

  try {
    const { data } = await axios.post("http://localhost:8035/user/login", {
      user_mail,
      user_password,
    });

    localStorage.setItem(sessionTokenName, data.message);
    window.location.href = "pokedex.html";
    console.log(data);
  } catch (error) {
    const {
      response: { data },
    } = error;
    alert(data.message);
    console.error(data);
  }
};

window.onload = init;
