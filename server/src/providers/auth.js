const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkExistUser = async (userName, attributesFind = []) => {
  try {
    const existUser = await User.findOne({
      where: {
        username: userName,
      },
      attributes: attributesFind.length > 0 ? attributesFind : undefined,
    });
    console.log(existUser);

    return existUser;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al obtener el usuario desde la base de datos");
  }
};

const registerUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      username: userData.username,
      password: hashedPassword,
    });
    return newUser;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al registrar desde la base de datos");
  }
};

const loginUser = async (thisUser, password) => {
  try {
    const isPasswordValid = await bcrypt.compare(password, thisUser.password);
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { username: thisUser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const userLogged = {
      token: token,
    };

    return userLogged;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al registrar desde la base de datos");
  }
};

module.exports = {
  checkExistUser,
  registerUser,
  loginUser,
};
