
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.IS_LOCAL ? undefined : { rejectUnauthorized: false },
})

const getAllTweets = (request, response) => {
    pool.query('SELECT tweets.id, tweets.message, tweets.created_at, users.id AS UserId, users.username, users.name FROM tweets JOIN users ON tweets.user_id = users.id ORDER BY created_at DESC;', (error, results) => {
        if(error) {
            throw(error)
        }
        response.send(results.rows)
    })
}

const getTweetsByUsername = (request, response) => {
    const username = request.params.username;
    console.log(username)


    pool.query('SELECT tweets.id, tweets.message, tweets.created_at, users.id AS UserId, users.username, users.name FROM tweets JOIN users ON tweets.user_id = users.id WHERE users.username = $1 ORDER BY created_at DESC;', [username], (error, results) => {
        if (error) {
            throw error
        }
        response.send(results.rows)
    })
}

const postTwat = (request, response) => {
    console.log('PostTwat function running');
    const userId = request.params.userId;
    const message = request.body.message;
  
    pool.query('INSERT INTO tweets (user_id, message) VALUES ($1, $2)', [userId, message], (error, results) => {
        if(error){
            throw error
        } response.send(`Successfully posted: ${message} as userId: ${userId}`)
    })
}

function getUserByUserId (user_id) {
  return (
    pool.query('SELECT* FROM users WHERE id = $1', [user_id])
    .then(res => res.rows[0])
  )
}
function getUserByUsername (username) {
  return (
    pool.query('SELECT* FROM users WHERE username = $1', [username])
    .then(res => res.rows[0])
  )
}

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw (error)
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, username, password } = request.body
const checkUsername = pool.query('SELECT* FROM users WHERE username=$1', [username], (error, results) => {
  if(error){
    throw(error)
  } else {
    return results.rows[0].json();
  }
})
  if(checkUsername) {
    response.status(409).send('Sorry, username already taken')
  }
  pool.query('INSERT INTO users (name, username, password) VALUES ($1, $2, $3)', [name, username, password], (error, results) => {
    if (error) {
      throw error
    }
    let valid = pool.query('SELECT* FROM users WHERE username = $1', [username], (err, res) => {
      response.status(201).json(res.rows)
    })
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  postTwat,
  getAllTweets,
  getTweetsByUsername,
  getUserByUsername,
  getUserByUserId,
  createUser,
  updateUser,
  deleteUser,
}

const username = 'thobias';
async function test () {
  let test = await pool.query('SELECT* FROM users WHERE username=$1', [username])
  .then(data => { return data.rows[0].name})
  .catch(err => new Error (err))
  console.log(test)
}
test()

async function test2 (username) {
  let output = await pool.query('SELECT* FROM users WHERE username=$1', [username], async (error, results) => {
    if(error){
      throw(error)
    } else {
      return await results.rows[0];
    }
  })
  return output
}

console.log(test2('thobias'))