const UserModel = require("../Models/user_models");
const {
  tokenGenerator,
  hashPassword,
  checkPassword,
} = require("../Utils/Utils");

const Register = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  if (!fullname || !username || !email || !password) {
    return res.status(400).json({ error: "One or more field missing" });
  }

  const existisingUsername = await UserModel.findOne({ username: username }) ;
  const existisingUser = await UserModel.findOne({ email: email }) ;

  if (existisingUser) {
    return res
      .status(500)
      .json({ error: "User With this email already exist" });
  }
  if (existisingUsername) {
    return res
      .status(500)
      .json({ error: "User With this username already exist" });
  }

  try {
    const user = new UserModel({
      fullname,
      username,
      email,
      password,
    });
    user.password = await hashPassword(password);
    const savedUser = await user.save();
    res.status(201).json({
      result: "User Signed up Successfully",
      User: { token: tokenGenerator(savedUser._id) },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ result: "Something went wrong" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "One or more field missing" });
  }

  try {
    const userInDb = await UserModel.findOne({ email: email });
    if (!userInDb) {
      return res.status(401).json({ error: "No user Found" });
    }

    const passwordMatch = await checkPassword(password, userInDb.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    res.status(201).json({
      result: {
        token: tokenGenerator(userInDb._id),
        user: {
          _id: userInDb._id,
          email,
          username: userInDb.username,
          fullname: userInDb.fullname,
          following: userInDb.following,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Register, Login };
