const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { secretKey, APP_PORT } = require('./configs.js')
const { prepareDb, populateTable } = require('./dbconn.js')
const { signUpUser, logInUser, getAllUsers, getUserTasks, addUserTask } = require('./dbqueries.js')

prepareDb()
    .then(() => {
        populateTable()
    })

const corsOptions = {
    origin: 'http://localhost'
}
const app = express()

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/signup', signUpUser)
app.post('/login', logInUser)
app.post('/addtask', addUserTask)

app.get('/', (req, res) => {
    res.status(200).send('Welcome to main page')
})

app.get('/users', getAllUsers)

app.get('/api', (req, res) => {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        return jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send('TOKEN VERIFICATION FAILED ' + err)
            }
            res.status(200).send('TOKEN VERIFICATION SUCCEED')
            console.log(decoded)
        })
    }
    return res.status(401).send('TOKEN NOT PROVIDED')
})

app.get('/api/gettasks', getUserTasks)

const listener = app.listen(APP_PORT || 3000, () => console.log(`Server started, 
listening on port: ${listener.address().port}`))