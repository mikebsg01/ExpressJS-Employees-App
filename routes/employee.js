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
      const employee_id = result.insertId;

      let query = `
        SELECT * FROM employees 
        WHERE id = ${employee_id}
        LIMIT 1
      `;

      const employeeFound = await db.query(query);

      if (employeeFound.length > 0) {
        return res.status(201).json({
          code: 201,
          message: "Empleado insertado correctamente",
          employee: employeeFound[0],
        });
      }
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
  const { name, last_name, phone_number, email, address } = req.body;

  if (name && last_name && phone_number && email && address) {
    const query = `
      UPDATE employees
      SET name = '${name}', 
        last_name = '${last_name}', 
        phone_number = '${phone_number}', 
        email = '${email}',
        address = '${address}'
      WHERE id = ${id}
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

employee.get("/:id([0-9]{1,11})", async (req, res, next) => {
  const id = req.params.id;

  const employeeFound = await db.query(
    `SELECT * FROM employees WHERE id = ${id} LIMIT 1`
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

employee.get("/search", async (req, res, next) => {
  const { query } = req.query;
  const employeeFound = await db.query(
    `SELECT * FROM employees 
    WHERE name LIKE "%${query}%" OR
          last_name LIKE "%${query}%"`
  );

  if (employeeFound.length > 0) {
    return res.status(200).json({
      code: 200,
      message: employeeFound,
    });
  }

  return res.status(404).json({
    code: 404,
    message: "Empleado(s) no encontrado(s) :(",
  });
});

module.exports = employee;
