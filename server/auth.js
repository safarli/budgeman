const jwt = require('jsonwebtoken')
const db = require('./db.js')
const bcryptjs = require('bcryptjs')
const secretKey = require('./configs.js').secretKey


const signUpUser = (req, res) => {
    const { username, password } = req.body

    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password, salt)

    const result = db.addUser(username, hashedPassword)

    const resultstr = `USER ADDED WITH ID: ${result}`
    console.log(resultstr)
    res.status(200).send(resultstr)
}

const logInUser = (req, res) => {
    const { username, password } = req.body
    const user = db.getUsers().find(user => {
        if (user.username === username && bcryptjs.compareSync(password, user.hashedPassword)) {
            return user
        }
    })
    if (user) {
        const signOptions = {
            expiresIn: '60s'
        }
        const payload = {
            userId: 199201,
            role: 'admin'
        }
        const token = jwt.sign(payload, secretKey, signOptions)
        res.setHeader('Content-Type', 'text/plain')
        res.status(200).send(token)
    } else {
        res.status(401).send('LOG IN FAILED!')
    }
}

module.exports = {
    signUpUser,
    logInUser,
}