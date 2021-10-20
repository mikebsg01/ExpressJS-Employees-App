const employeeList = [];

const getEmployee = async (employee_id) => {
  try {
    const {
      data: { message },
    } = await axios.get(url(`/employees/${employee_id}`));
    return message;
  } catch (error) {
    const {
      response: { data },
    } = error;
    console.error(data);
    return [];
  }
};

const getEmployees = async (query) => {
  try {
    let result;
    if (query) {
      result = await axios.get(url(`/employees/search?query=${query}`), {
        query,
      });
    } else {
      result = await axios.get(url("/employees"));
    }
    return result.data.message;
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
      `\t\t<button data-id="${employee.id}" class="btn btn-primary edit-employee">Actualizar</button>` +
      `\t\t<button data-id="${employee.id}" data-name="${employee.name}" class="btn btn-danger delete-employee">Borrar</button>` +
      `\t</div>` +
      `</div>`
  );

  updateEmployeeCount();
};

const displayEmployeeList = () => {
  for (let i = 0; i < employeeList.length; ++i) {
    displayEmployee(employeeList[i]);
  }
};

const updateEmployeeCount = () => {
  console.log(`count: ${employeeList.length}`);
  const employeeCountElement = $("#employee-count");
  employeeCountElement.text(`${employeeList.length}`);
};

const loadEmployees = async (query) => {
  const employees = query ? await getEmployees(query) : await getEmployees();
  employeeList.push(...employees);
  console.log({ employeeList });
  displayEmployeeList();
};

const clearForm = () => {
  $("#input-id").val("");
  $("#input-name").val("");
  $("#input-last-name").val("");
  $("#input-phone-number").val("");
  $("#input-email").val("");
  $("#input-address").val("");
};

const addEmployee = (employee) => {
  employeeList.push(employee);
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
      const {
        data: { employee },
      } = await axios.post("http://localhost:8035/employees", employee_data);

      alert("Empleado agregado exitosamente! :)");
      addEmployee(employee);
      displayEmployee(employee);
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

  updateEmployeeCount();
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
    } catch (error) {
      const {
        response: { data },
      } = error;
      console.error(data);
    }
  }
};

const clearEmployeeList = () => {
  employeeList.splice(0, employeeList.length);
  $("#employee-list").empty();
};

const searchEmployeeEvent = async function () {
  const query = $("#input-search").val();
  clearEmployeeList();
  loadEmployees(query);
};

const setForm = (employee) => {
  $("#input-id").val(employee.id);
  $("#input-name").val(employee.name);
  $("#input-last-name").val(employee.last_name);
  $("#input-phone-number").val(employee.phone_number);
  $("#input-email").val(employee.email);
  $("#input-address").val(employee.address);
};

const setEmployeeToEditEvent = async function () {
  const employee_id = $(this).data("id");
  const employee = await getEmployee(employee_id);
  setForm(employee);

  $("#btn-submit").addClass(["invisible", "d-none"]);
  $("#btn-edit").removeClass(["invisible", "d-none"]);
  $("#btn-cancel").removeClass(["invisible", "d-none"]);
};

const cancelEditEmployeeEvent = () => {
  clearForm();

  $("#btn-submit").removeClass(["invisible", "d-none"]);
  $("#btn-edit").addClass(["invisible", "d-none"]);
  $("#btn-cancel").addClass(["invisible", "d-none"]);
};

const editEmployeeFromList = (employee_id, employee) => {
  removeEmployeeFromList(employee_id);
  employee = { ...employee, id: employee_id };
  addEmployee(employee);
  displayEmployee(employee);
};

const editEmployeeEvent = async function () {
  const employee_id = $("#input-id").val();
  const name = $("#input-name").val();
  const last_name = $("#input-last-name").val();
  const phone_number = $("#input-phone-number").val();
  const email = $("#input-email").val();
  const address = $("#input-address").val();

  if (name && last_name && phone_number && email && address) {
    let employee_data = {
      name,
      last_name,
      phone_number,
      email,
      address,
    };

    console.log({ employee_data });

    try {
      const { data } = await axios.put(
        `http://localhost:8035/employees/${employee_id}`,
        employee_data
      );

      console.log(data);
      alert("Los datos del empleado han sido modificados!");
      cancelEditEmployeeEvent();
      editEmployeeFromList(employee_id, employee_data);
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

$(document).ready(async function () {
  if (!checkIfUserIsLoggedIn()) {
    window.location.href = "index.html";
  }

  $("#btn-search").on("click", searchEmployeeEvent);
  $("#btn-submit").on("click", createEmployeeEvent);
  $("#btn-cancel").on("click", cancelEditEmployeeEvent);
  $("#btn-edit").on("click", editEmployeeEvent);
  $("#employee-list").on("click", ".delete-employee", removeEmployeeEvent);
  $("#employee-list").on("click", ".edit-employee", setEmployeeToEditEvent);

  await loadEmployees();
});
