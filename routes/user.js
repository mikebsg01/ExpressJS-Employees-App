const express = require("express");
const jwt = require("jsonwebtoken");
const user = express.Router();
const db = require("../config/database");

user.post("/login", async (req, res, next) => {
  const { user_mail, user_password } = req.body;

  if (user_mail && user_password) {
    const query = `
      SELECT * FROM user 
      WHERE user_mail = '${user_mail}' AND
            user_password = '${user_password}'
    `;
    let result = await db.query(query);

    if (result.length == 1) {
      result = result[0];

      const token = jwt.sign(
        {
          user_id: result.user_id,
          user_mail: result.user_mail,
        },
        "debugkey"
      );

      return res.status(200).json({ code: 200, message: token });
    }

    return res
      .status(401)
      .json({ code: 401, message: "Usuario y/o contraseña incorrectos" });
  }

  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

module.exports = user;
