const jwt = require("jsonwebtoken");

function generateAccessToken(username) {
  // console.log("func 1");
  return jwt.sign(username, process.env.TOKEN_SECRET, {});
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.CurrentuserId = user;
    next();
  });
}

module.exports = {
  generateAccessToken,
  authenticateToken,
};
