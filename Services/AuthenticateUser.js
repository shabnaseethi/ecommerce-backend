const client = require("../config/dbconfig");
const bcrypt = require("bcrypt");

module.exports = class AuthService {
  async login(data) {
    const { email, password } = data;
    const users = await client.query(`SELECT * FROM customer WHERE email=$1`, [
      email,
    ]);
    if (users.rows.length > 0) {
      const user = users.rows[0];
      const validPassword = await bcrypt.compare(password.toString(), user.password);
      if (!validPassword) {
        return { status: 401, error: "Incorrect password" };
      }
      return { status: 200,auth:true, error: "Success",user:user };
    } else {
      return { status: "error",auth:false, message: "No User Exists" };
    }
  }
};
