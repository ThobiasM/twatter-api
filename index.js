require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const port = process.env.PORT;
const secret = process.env.SECRET;


const Pool = require("pg").Pool;
// const pool = new Pool({
//   user: "thobias",
//   host: "localhost",
//   database: "twatter",
//   password: "password",
//   port: 5433,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.IS_LOCAL ? undefined : { rejectUnauthorized: false },
})


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.get("/tweets", db.getAllTweets);
app.get("/tweets/:username", db.getTweetsByUsername);
// app.post('/tweets/:userId', db.postTwat)
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  console.log(username);
  console.log(password);

  try {
    const user = await db.getUserByUsername(username);

    if (!user) {
      return res.status(401).send({ error: "Wrong username" });
    }
    if (password !== user.password) {
      return res.status(401).send({ error: "Wrong password" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
      },
      Buffer.from(secret, "Base64")
    );
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/tweets/:userId", async (req, res) => {
  
  const userId = req.params.userId;
  const message = req.body.message;
  const token = req.headers["x-auth-token"];

  try {
    const payload = jwt.verify(token, Buffer.from(secret, "Base64"));
    pool.query(
      "INSERT INTO tweets (user_id, message) VALUES ($1, $2)",
      [userId, message],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.send(
          `Successfully posted: ${message} as user: ${payload.username}. Btw, your token is ${token}`
        );
      }
    );
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});




pool.query('SELECT* FROM users', (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})