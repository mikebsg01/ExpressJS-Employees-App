const init = () => {
  if (checkIfUserIsLoggedIn()) {
    window.location.href = "employees.html";
  }

  document.querySelector("#btn-submit").addEventListener("click", login);
};

const login = async () => {
  const email = document.getElementById("input-mail").value;
  const password = document.getElementById("input-password").value;

  console.log({ email, password });

  try {
    const { data } = await axios.post("http://localhost:8035/user/login", {
      email,
      password,
    });

    localStorage.setItem(sessionTokenName, data.message);
    window.location.href = "employees.html";
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
