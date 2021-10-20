const getEmployees = async () => {
  try {
    const {
      data: { message },
    } = await axios.get(url("/employees"));
    return message;
  } catch (error) {
    const {
      response: { data },
    } = error;
    console.error(data);
    return [];
  }
};

const displayEmployees = (employees) => {
  const list = document.querySelector("#employee-list");

  for (let i = 0; i < employees.length; ++i) {
    list.innerHTML +=
      `<div class="card mb-3">` +
      `\t<div class="card-body">` +
      `\t\t<h3>${employees[i].name} ${employees[i].last_name}</h3>` +
      `\t\t<a href="mailto:${employees[i].email}">${employees[i].email}</a>` +
      `\t\t<p>${employees[i].phone_number}</p>` +
      `\t\t<p>${employees[i].address}</p>` +
      `\t</div>` +
      `</div>`;
  }
};

const loadEmployees = async () => {
  const employees = await getEmployees();
  console.log({ employees });
  displayEmployees(employees);
};

const signin = async () => {
  const name = document.getElementById("input-name").value;
  const last_name = document.getElementById("input-last-name").value;
  const phone_number = document.getElementById("input-phone-number").value;
  const email = document.getElementById("input-email").value;
  const address = document.getElementById("input-address").value;

  if (name && last_name && phone_number && email && address) {
    const employee_data = {
      name,
      last_name,
      phone_number,
      email,
      address,
    };

    console.log({ employee_data });

    try {
      const { data } = await axios.post(
        "http://localhost:8035/employees",
        employee_data
      );

      console.log(data);
      alert("Empleado agregado exitosamente! :)");
    } catch (error) {
      const {
        response: { data },
      } = error;
      console.error(data);
    }
  } else {
    alert("Campos incompletos! Por favor, llena los campos faltantes.");
  }
};

const init = async () => {
  if (!checkIfUserIsLoggedIn()) {
    window.location.href = "index.html";
  }

  document.querySelector("#btn-submit").addEventListener("click", signin);

  await loadEmployees();
};

window.onload = init;
