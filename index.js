// Dependencies
const express = require("express");
const app = express();

// Routes
const employee = require("./routes/employee");
const user = require("./routes/user");

// Middleware
const cors = require("./middleware/cors");
const auth = require("./middleware/auth");
const notFound = require("./middleware/notFound");

app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  return res.status(200).send({
    code: 1,
    message:
      "Bienvenido al app para gestion de datos de empleados :) - Taller de Node.js S.A. de C.V.",
  });
});

app.use("/user", user);

app.use(auth);

app.use("/employee", employee);

app.use(notFound);

app.listen(process.env.PORT || 8035, () => {
  console.log("App running in port 8035");
});
