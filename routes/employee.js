const express = require("express");
const employee = express.Router();
const db = require("../config/database");

employee.post("/", async (req, res, next) => {
  const { name, last_name, phone_number, email, address } = req.body;

  if (name && last_name && phone_number && email && address) {
    let query = `
      INSERT INTO employees (name, last_name, phone_number, email, address)
      VALUES('${name}', '${last_name}', '${phone_number}', '${email}', '${address}');
    `;

    const result = await db.query(query);

    if (result.affectedRows === 1) {
      return res
        .status(201)
        .json({ code: 201, message: "Empleado insertado correctamente" });
    }

    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }

  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

employee.delete("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = req.params.id;
  const query = `DELETE FROM employees WHERE id = ${id}`;
  const result = await db.query(query);

  if (result.affectedRows == 1) {
    return res.status(200).json({
      code: 200,
      message: "Empleado eliminado correctamente",
    });
  }

  return res.status(404).json({
    code: 404,
    message: "Empleado no encontrado",
  });
});

employee.put("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = req.params.id;
  const { name, last_name, phone_number, email } = req.body;

  if (name && last_name && phone_number && email) {
    const query = `
      UPDATE employee
      SET name = '${name}', 
        last_name = ${last_name}, 
        phone_number = ${phone_number}, 
        email = ${email}
      WHERE pok_id = ${id}
    `;

    const result = await db.query(query);

    if (result.affectedRows === 1) {
      return res
        .status(201)
        .json({ code: 201, message: "Empleado actualizado correctamente" });
    }

    return res.status(500).json({ code: 500, message: "Ocurrió un error" });
  }

  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

employee.get("/", async (req, res, next) => {
  const employees = await db.query("SELECT * FROM employees");
  return res.status(200).json({
    code: 200,
    message: employees,
  });
});

employee.get("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = req.params.id;

  const employees = await db.query(
    `SELECT * FROM employees WHERE id = ${id} LIMIT 1`
  );

  if (employees.length > 0) {
    return res.status(200).json({
      code: 200,
      message: employees,
    });
  }

  return res.status(404).json({
    code: 404,
    message: "Empleado no encontrado :(",
  });
});

employee.get("/:name([A-Za-z]+)", async (req, res, next) => {
  const name = req.params.name;
  const employeeFound = await db.query(
    `SELECT * FROM employees WHERE name LIKE "${name}" LIMIT 1`
  );

  if (employeeFound.length > 0) {
    return res.status(200).json({
      code: 200,
      message: employeeFound[0],
    });
  }

  return res.status(404).json({
    code: 404,
    message: "Empleado no encontrado :(",
  });
});

module.exports = employee;
