const employeeList = [];

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

const displayEmployee = (employee) => {
  const listElement = document.querySelector("#employee-list");

  listElement.innerHTML +=
    `<div class="card mb-3">` +
    `\t<div class="card-body">` +
    `\t\t<h3>${employee.name} ${employee.last_name}</h3>` +
    `\t\t<a href="mailto:${employee.email}">${employee.email}</a>` +
    `\t\t<p>${employee.phone_number}</p>` +
    `\t\t<p>${employee.address}</p>` +
    `\t</div>` +
    `</div>`;
};

const displayEmployeeList = () => {
  for (let i = 0; i < employeeList.length; ++i) {
    displayEmployee(employeeList[i]);
  }
};

const updateEmployeeCount = () => {
  const employeeCountElement = document.querySelector("#employee-count");
  employeeCountElement.innerHTML = `${employeeList.length}`;
};

const loadEmployees = async () => {
  const employees = await getEmployees();
  employeeList.push(...employees);
  console.log({ employeeList });
  displayEmployeeList();
  updateEmployeeCount();
};

const clearForm = () => {
  document.getElementById("input-name").value = "";
  document.getElementById("input-last-name").value = "";
  document.getElementById("input-phone-number").value = "";
  document.getElementById("input-email").value = "";
  document.getElementById("input-address").value = "";
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
      employeeList.push(employee_data);
      displayEmployee(employee_data);
      updateEmployeeCount();
      clearForm();
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
