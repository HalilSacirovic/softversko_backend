const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token nije obezbeđen" });
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Nevalidan token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
