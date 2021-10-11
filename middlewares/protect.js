const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({ msg: "Not Authorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Not Authorized" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = protect;
