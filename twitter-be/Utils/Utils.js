const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const bcryptjs = require("bcryptjs");

const tokenGenerator = (id) => {
  return jwt.sign({ id }, JWT_SECRET);
};

const hashPassword = (password) => bcryptjs.hash(password, 10);

const checkPassword = (userPassword, dbPassword) =>
  bcryptjs.compare(userPassword, dbPassword);

module.exports = { tokenGenerator, hashPassword, checkPassword };
