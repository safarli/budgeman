const { Client, Pool } = require('pg')
const bcryptjs = require('bcryptjs')
const { PG_CONFIG } = require('./configs.js')
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
        .catch((error) => { console.log(error) })
}

const logInUser = (req, res) => {
    const { username, password } = req.body
    pool.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then((result) => {
            const { rows } = result
            if (rows.length === 0) {
                res.status(401).send('USER NOT FOUND')
                return 'USER NOT FOUND IN DB'
            }
            const passwordMatch = bcryptjs.compareSync(password, rows[0].password)
            if (passwordMatch) {
                return res.status(201).send('LOG IN SUCCESSFUL')
            }
            return res.status(401).send('LOG IN UNSUCCESSFUL')
        })
        .catch((error) => console.log(error))
}

module.exports = {
    signUpUser,
    logInUser
}