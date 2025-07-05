const mysql = require("mysql2/promise");
const client = mysql.createPool(process.env.CONNECTION_STRING);

async function selectSysUsers() {
  const results = await client.query("SELECT * FROM sys_user;");
  return results[0];
}

async function selectSysUserById(id) {
  const results = await client.query("SELECT * FROM sys_user WHERE id = ?;", [
    id,
  ]);
  return results[0];
}

async function selectAircrafts() {
  const results = await client.query("SELECT * FROM aircraft;");
  return results[0];
}

async function selectBoardingPass() {
  const results = await client.query("SELECT * FROM boarding_pass;");
  return results[0];
}

async function selectFlights() {
  const results = await client.query("SELECT * FROM flight;");
  return results[0];
}

async function selectPassengers() {
  const results = await client.query("SELECT * FROM passenger;");
  return results[0];
}

async function insertSysUser(user) {
  await client.query(
    "INSERT INTO sys_user(name, login_email, password, user_type) VALUES(?, ?, ?, ?);",
    [user.name, user.login_email, user.password, user.user_type]
  );
}

async function updateSysUser(id, user) {
  await client.query(
    "UPDATE sys_user SET name = ?, login_email = ?, password = ?, user_type = ? WHERE id = ?;",
    [user.name, user.login_email, user.password, user.user_type, id]
  );
}

async function deleteSysUser(id) {
  await client.query("DELETE FROM sys_user WHERE id = ?;", [id]);
}

async function selectSysUserByEmail(login_email) {
  const results = await client.query(
    "SELECT * FROM sys_user WHERE login_email = ?;",
    [login_email]
  );
  return results[0];
}

module.exports = {
  selectSysUsers,
  selectSysUserById,
  insertSysUser,
  updateSysUser,
  deleteSysUser,
  selectSysUserByEmail,
  selectAircrafts,
  selectBoardingPass,
  selectFlights,
  selectPassengers,
};
