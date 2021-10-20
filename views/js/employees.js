const getEmployees = async () => {
  try {
    const {
      data: { message },
    } = await axios.get(url("/employee"));
    return message;
  } catch (error) {
    const {
      response: { data },
    } = error;
    console.error(data);
    return [];
  }
};

const displayEmployee = (employee) => {
  const body = document.querySelector("#pokedex-list");

  for (let i = 0; i < employee.length; ++i) {
    body.innerHTML += `<h3>${employee[i].pok_name}</h3>`;
  }
};

const loadEmployee = async () => {
  const employee = await getEmployees();
  console.log({ employee });
  displayEmployee(employee);
};

const init = async () => {
  if (!checkIfUserIsLoggedIn()) {
    window.location.href = "index.html";
  }

  await loadEmployee();
};

window.onload = init;
