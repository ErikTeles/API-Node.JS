const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: "Token não fornecido." });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ auth: false, message: "Falha na autenticação do token." });
    }

    req.userId = decoded.userId;
    req.userType = decoded.userType;

    next();
  });
}

function verifyAdmin(req, res, next) {
  if (req.userType !== "admin") {
    return res
      .status(403)
      .json({ auth: false, message: "Acesso negado. Apenas administradores." });
  }

  next();
}

module.exports = {
  verifyJWT,
  verifyAdmin,
};
