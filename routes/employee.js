const express = require("express");
const employee = express.Router();
const db = require("../config/database");

employee.post("/", async (req, res, next) => {
  const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;

  if (pok_name && pok_height && pok_weight && pok_base_experience) {
    let query = `
      INSERT INTO employee(pok_name, pok_height, pok_weight, pok_base_experience)
      VALUES('${pok_name}', ${pok_height}, ${pok_weight}, ${pok_base_experience});
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
  const query = `DELETE FROM employee WHERE pok_id=${id}`;
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
  const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;

  if (pok_name && pok_height && pok_weight && pok_base_experience) {
    const query = `
      UPDATE employee
      SET pok_name = '${pok_name}', 
        pok_height = ${pok_height}, 
        pok_weight = ${pok_weight}, 
        pok_base_experience = ${pok_base_experience}
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

employee.patch("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = req.params.id;
  const { pok_name } = req.body;

  if (pok_name) {
    const query = `
        UPDATE employee
        SET pok_name = '${pok_name}'
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
  const pk = await db.query("SELECT * FROM employee");
  return res.status(200).json({
    code: 200,
    message: pk,
  });
});

employee.get("/:id([0-9]{1,3})", async (req, res, next) => {
  const id = req.params.id;

  if (id >= 1 && id <= 722) {
    const pk = await db.query(
      `SELECT * FROM employee WHERE pok_id = ${id} LIMIT 1`
    );
    return res.status(200).json({
      code: 200,
      message: pk[0],
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
    `SELECT * FROM employee WHERE pok_name LIKE "${name}" LIMIT 1`
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
