const axios = require("axios");
const { CANVAS_BASE_URL } = require("../config/config");

const validateCanvasAccount = async (req, res, next) => {
  if (!req.body.token)
    return res.status(400).send({ message: "api key required" });
  if (!req.body.username)
    return res.status(400).send({ message: "username is required" });
  const endpoint = CANVAS_BASE_URL + "users/self/profile";

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${req.body.token}` },
    });

    const data = response.data;

    const email = data.primary_email.toLowerCase();

    const loginId = data.login_id.toLowerCase();

    if (
      req.body.username.toLowerCase() !== email &&
      req.body.username.toLowerCase() !== loginId
    ) {
      return res.status(500).send({
        message:
          "Username/Email does not match the account associated with the developer key",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "invalid api key" });
  }
};
module.exports = validateCanvasAccount;
