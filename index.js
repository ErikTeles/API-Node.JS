require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const db = require("./src/lib/db");
const functions = require("./src/lib/functions");

app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    message: "API funcionando!",
  });
});

app.get("/aircrafts", async (req, res, next) => {
  const results = await db.selectAircrafts();
  res.json(results);
});

app.get("/boarding_pass", async (req, res, next) => {
  const results = await db.selectBoardingPass();
  res.json(results);
});

app.get("/flights", async (req, res, next) => {
  const results = await db.selectFlights();
  res.json(results);
});

app.get("/passengers", async (req, res, next) => {
  const results = await db.selectPassengers();
  res.json(results);
});

app.get("/users", functions.verifyJWT, async (req, res, next) => {
  const results = await db.selectSysUsers();
  res.json(results);
});

app.get("/users/:id", functions.verifyJWT, async (req, res, next) => {
  const id = parseInt(req.params.id);
  const results = await db.selectSysUserById(id);
  res.json(results);
});

app.post(
  "/users",
  functions.verifyJWT,
  functions.verifyAdmin,
  async (req, res, next) => {
    await db.insertSysUser(req.body);
    res.sendStatus(201);
  }
);

app.post("/login", async (req, res, next) => {
  const { login_email, password } = req.body;

  try {
    const results = await db.selectSysUserByEmail(login_email);

    if (results.length === 0) {
      return res
        .status(401)
        .json({ auth: false, message: "Usuário não encontrado." });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ auth: false, message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { userId: user.id, userType: user.user_type },
      process.env.SECRET,
      { expiresIn: 300 }
    );

    return res.json({ auth: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

app.put("/users/:id", functions.verifyJWT, async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (req.userType !== "admin" && req.userId !== id) {
    return res.status(403).json({
      auth: false,
      message: "Acesso negado. Você só pode alterar seus próprios dados.",
    });
  }

  await db.updateSysUser(id, req.body);
  res.sendStatus(200);
});

app.delete("/users/:id", functions.verifyJWT, async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (req.userType !== "admin" && req.userId !== id) {
    return res.status(403).json({
      auth: false,
      message: "Acesso negado. Você só pode apagar seus próprios dados.",
    });
  }

  await db.deleteSysUser(id);
  res.sendStatus(204);
});

app.listen(process.env.PORT, () => {
  console.log("A API está sendo executada! (CTRL+C para finalizar)");
});

// 200 = OK
// 201 = CREATED
// 204 = NO CONTENT
// 401 = UNAUTHORIZED
// 401 = FORBIDDEN
// 500 = INTERNAL SERVER ERROR
