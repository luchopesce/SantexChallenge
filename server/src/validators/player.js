const { param } = require("express-validator");

const playerValidations = [
  param("id")
    .isInt()
    .withMessage("El ID del player debe ser int y no debe ser null ni vacío")
    .notEmpty(),
  param("v")
    .custom((value) => {
      if (value.trim() === "" || value === ":v") {
        throw new Error(
          "La versión de FIFA no debe ser vacía ni un valor no significativo"
        );
      }
      return true;
    })
    .isString()
    .withMessage(
      "La versión de FIFA debe ser una cadena de texto y no debe ser null ni vacio"
    ),
];

module.exports = playerValidations;
