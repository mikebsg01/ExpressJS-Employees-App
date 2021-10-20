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
  const listElement = $("#employee-list");

  listElement.prepend(
    `<div id="employee-${employee.id}" class="card mb-3">` +
      `\t<div class="card-body">` +
      `\t\t<h3>${employee.name} ${employee.last_name}</h3>` +
      `\t\t<p class="mb-1"><a href="mailto:${employee.email}">${employee.email}</a></p>` +
      `\t\t<p class="mb-1">${employee.phone_number}</p>` +
      `\t\t<p class="mb-0">${employee.address}</p>` +
      `\t</div>` +
      `\t<div class="card-footer text-right">` +
      `\t\t<button class="btn btn-primary update-employee">Actualizar</button>` +
      `\t\t<button data-id="${employee.id}" data-name="${employee.name}" class="btn btn-danger delete-employee">Borrar</button>` +
      `\t</div>` +
      `</div>`
  );
};

const displayEmployeeList = () => {
  for (let i = 0; i < employeeList.length; ++i) {
    displayEmployee(employeeList[i]);
  }
};

const updateEmployeeCount = () => {
  const employeeCountElement = $("#employee-count");
  employeeCountElement.text(`${employeeList.length}`);
};

const loadEmployees = async () => {
  const employees = await getEmployees();
  employeeList.push(...employees);
  console.log({ employeeList });
  displayEmployeeList();
  updateEmployeeCount();
};

const clearForm = () => {
  $("#input-name").clear();
  $("#input-last-name").clear();
  $("#input-phone-number").clear();
  $("#input-email").clear();
  $("#input-address").clear();
};

const createEmployeeEvent = async function () {
  const name = $("#input-name").val();
  const last_name = $("#input-last-name").val();
  const phone_number = $("#input-phone-number").val();
  const email = $("#input-email").val();
  const address = $("#input-address").val();

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

const removeEmployee = (employee_id) => {
  $(`#employee-${employee_id}`).remove();
};

const removeEmployeeFromList = (employee_id) => {
  const index = employeeList.findIndex((e) => e.id === employee_id);
  employeeList.splice(index, 1);

  removeEmployee(employee_id);
};

const removeEmployeeEvent = async function () {
  const employee_id = $(this).data("id");
  const employee_name = $(this).data("name");

  if (confirm(`Estas seguro de borrar a "${employee_name}" ?`)) {
    try {
      const { data } = await axios.delete(
        `http://localhost:8035/employees/${employee_id}`
      );

      console.log(data);
      alert("El empleado ha sido eliminado!");
      removeEmployeeFromList(employee_id);
      updateEmployeeCount();
    } catch (error) {
      const {
        response: { data },
      } = error;
      console.error(data);
    }
  }
};

$(document).ready(async function () {
  if (!checkIfUserIsLoggedIn()) {
    window.location.href = "index.html";
  }

  $("#btn-submit").on("click", createEmployeeEvent);
  $("#employee-list").on("click", ".delete-employee", removeEmployeeEvent);

  await loadEmployees();
});
