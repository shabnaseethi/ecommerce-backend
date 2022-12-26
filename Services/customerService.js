const client = require("../config/dbconfig");

module.exports = {
  create: (data, callback) => {
    client.query(
      `INSERT INTO customer(email,password,first_name,last_name) VALUES ($1,$2,$3,$4)`,
      [data.useremail, data.userpassword, data.firstname, data.lastname],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUsers: (callBack) => {
    client.query(
      `SELECT id,email,password,first_name,last_name from customer`,
      [],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
  getUserById: (id, callBack) => {
    client.query(
      `SELECT id,email,password,first_name,last_name from customer where id = $1`,
      [id],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
  updateUser: (data, callBack) => {
    client.query(
      `UPDATE customer set id =$1,email=$2,password=$3,first_name=$4,last_name=$5 where id=$6`,
      [data.id,data.email, data.password, data.first_name, data.last_name, data.id],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result.rows);
      }
    );
  },
  deleteUser:(data,callBack)=>{
    client.query(
        `DELETE FROM customer where id = $1`,
        [data.id],
        (err,result)=>{
            if(err){
                return callBack(err);
            }
            return callBack(null,result.rows)
        }
    )
  }
};
