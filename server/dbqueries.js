const { Client, Pool } = require('pg')
const bcryptjs = require('bcryptjs')
const { PG_CONFIG, secretKey } = require('./configs.js')
const jwt = require('jsonwebtoken')

const pool = new Pool(PG_CONFIG('ofisapi'))

const signUpUser = (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
    pool.query(`INSERT INTO users(username, password) VALUES ($1, $2)`, [username, hashedPassword])
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
    pool.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then((result) => {
            const { rows } = result
            if (rows.length === 0) {
                return res.status(401).send('USER NOT FOUND')
            }
            const passwordMatch = bcryptjs.compareSync(password, rows[0].password)
            if (passwordMatch) {
                const signOptions = {
                    expiresIn: '360s',
                    algorithm: 'HS256'
                }
                const payload = {
                    id: rows[0].user_id,
                    role: 'standard'
                }
                const token = jwt.sign(payload, secretKey, signOptions)
                return res.status(200).send(token)
            }

        })
        .catch((error) => console.log(error))
}

const getAllUsers = (req, res) => {
    pool.query(`SELECT * FROM users`)
        .then((result) => {
            console.log(result.rows)
            res.status(200).send(result.rows)
        })
        .catch((e) => console.log(e))
}

const getUserTasks = (req, res) => (req, res) => {
    const authHeader = req.headers['Authorization']
    if (authHeader) {
        const token = authHeader.split(' ')[0]
        return jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return console.log(err)
            return 0
            // --- CONTINUE FROM HERE --- //
        })
    }
    return res.status(401).send('NO TOKEN PROVIDED')
}

module.exports = {
    signUpUser,
    logInUser,
    getAllUsers,
    getUserTasks
}