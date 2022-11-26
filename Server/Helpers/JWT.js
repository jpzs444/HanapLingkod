const jwt = require("jsonwebtoken");

function generateAccessToken(username, role) {
  return jwt.sign(
    { username: username, role: role },
    process.env.TOKEN_SECRET,
    {}
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.CurrentuserId = user;
    next();
  });
}

module.exports = {
  generateAccessToken,
  authenticateToken,
};
