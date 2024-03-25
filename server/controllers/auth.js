const db = require("../config/db");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    if (!req.body.username)
      return res.status(400).send({ message: "username required" });
    if (!req.body.password)
      return res.status(400).send({ message: "password required" });

    const foundUser = await db.user.findByPk(req.body.username);

    if (!foundUser)
      return res.status(404).send({ message: "Account not found" });

    const match = await bcrypt.compare(req.body.password, foundUser.password);

    if (match) return res.status(200).send({ token: foundUser.token });

    res.status(401).send({ message: "Invalid password" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const register = async (req, res) => {
  try {
    if (!req.body.username)
      return res.status(400).send({ message: "username required" });
    if (!req.body.password)
      return res.status(400).send({ message: "password required" });
    if (!req.body.token)
      return res.status(400).send({ message: "api key required" });

    const foundUser = await db.user.findByPk(req.body.username);

    if (foundUser)
      return res.status(400).json({ error: "Account already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await db.user.create({
      username: req.body.username,
      password: hashedPassword,
      token: req.body.token,
    });

    res.status(200).json({ message: "Account Successfully Linked", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateKey = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.body.username);
    user.token = req.body.token;
    await user.save();
    res.status(200).json({ token: req.body.token });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error Updating Account Key: ${error.message}` });
  }
};

module.exports = { login, register, updateKey };
