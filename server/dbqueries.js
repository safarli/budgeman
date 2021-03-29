const { Client, Pool } = require('pg')
const bcryptjs = require('bcryptjs')
const { PG_CONFIG, secretKey } = require('./configs.js')
const jwt = require('jsonwebtoken')

const pool = new Pool(PG_CONFIG('ofisapi'))

const signUpUser = (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
    pool.query(`INSERT INTO users(username, password) VALUES ($1, $2);`, [username, hashedPassword])
        .then((result) => {
            console.log('User added to db')
            res.status(200).send('Sign up successful')
        })
        .catch((error) => {
            if (error.code === '23505') {
                return console.log('Username already exists, please try another username')
            }
            console.log('Error occured' + error)
        })
}

const logInUser = (req, res) => {
    const { username, password } = req.body
    pool.query(`SELECT * FROM users WHERE username = $1;`, [username])
        .then((result) => {
            const { rows } = result
            if (rows.length === 0) {
                return res.status(401).send('USER NOT FOUND')
            }
            const passwordMatch = bcryptjs.compareSync(password, rows[0].password)
            if (passwordMatch) {
                const signOptions = {
                    expiresIn: '1800s', // 30min
                    algorithm: 'HS256'
                }
                const payload = {
                    id: rows[0].user_id,
                    role: 'standard'
                }
                const token = jwt.sign(payload, secretKey, signOptions)
                return res.status(200).send(token)
            }
            return res.status(401).send('PASSWORD WRONG')
        })
        .catch((error) => console.log(error))
}

const getAllUsers = (req, res) => {
    pool.query(`SELECT user_id, username, password FROM users;`)
        .then((result) => {
            res.status(200).send(result.rows)
        })
        .catch((e) => console.log(e))
}

const getUserTasks = (req, res) => {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        return jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send('TOKEN VERIFICATION FAILED ' + err)
            }
            return pool.query(`SELECT task, TO_TIMESTAMP(date_added, 'YYYY-MM-DD HH:MI:SS') FROM user_tasks WHERE user_id = $1;`, [decoded.id])
                .then((result) => {
                    const { rows } = result
                    res.status(200).send(rows)
                })
        })
    }
    return res.status(401).send('NO TOKEN PROVIDED')
}

const addUserTask = (req, res) => {
    const authHeader = req.headers['authorization']
    const { task } = req.body
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        return jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send('TOKEN VERIFICATION FAILED ' + err)
            }
            return pool.query(`INSERT INTO user_tasks (task, user_id) VALUES ($1, $2);`, [task, decoded.id])
                .then((result) => {
                    console.log('task insert result ' + result.rows)
                    return res.status(200).send('Task inserted successfully insert id: ' + result.rows)
                })
                .catch((e) => {
                    return console.log(e)
                })

        })
    }
    return res.status(401).send('NO TOKEN PROVIDED')
}

module.exports = {
    signUpUser,
    logInUser,
    getAllUsers,
    getUserTasks,
    addUserTask
}