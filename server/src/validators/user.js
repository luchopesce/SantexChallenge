const { body } = require("express-validator");

const userValidations = [
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario no debe estar vacío")
    .isLength({ min: 3 })
    .withMessage("El nombre de usuario debe tener al menos 3 caracteres"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña no debe estar vacía")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

module.exports = userValidations;
