const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const auth = require('./auth.js')
const { secretKey, APP_PORT } = require('./configs.js')
const { prepareDb } = require('./dbconn.js')

prepareDb()

const corsOptions = {
    origin: 'http://localhost'
}
const app = express()

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/signup', auth.signUpUser)
app.post('/login', auth.logInUser)

app.get('/', (req, res) => {
    res.status(200).send('Welcome to main page')
})

app.get('/api', (req, res) => {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send('TOKEN VERIFICATION FAILED')
            }
            res.status(200).send('TOKEN VERIFICATION SUCCEED')
            console.log(decoded)
        })
    }
    else {
        res.status(401).send('TOKEN NOT PROVIDED')
    }
})

const listener = app.listen(APP_PORT || 3000, () => console.log(`Server started, 
listening on port: ${listener.address().port}`))