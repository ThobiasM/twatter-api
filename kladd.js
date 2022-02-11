const Pool = require("pg").Pool;
const pool = new Pool({
  user: "thobias",
  host: "localhost",
  database: "twatter",
  password: "password",
  port: 5433,
});

// const username = 'itsBritneyBitch';
// async function test () {
//   let test = await pool.query('SELECT* FROM users WHERE username=$1', [username])
//   .then(data => { return data.rows[0]})
//   .catch(err => new Error (err))
//   console.log(test)
// }
// test()

// async function test2 (username) {
//   let output = await pool.query('SELECT* FROM users WHERE username=$1', [username], async (error, results) => {
//     if(error){
//       throw(error)
//     } else {
//       return await results.rows[0];
//     }
//   })
//   return output
// }

// console.log(test2('thobias'))

const username = 'itsBritneyBitch';
  let test = pool.query('SELECT* FROM users WHERE username=$1', [username])
  .then(data => { console.log(data.rows[0])})
  .catch(err => new Error (err))

