const { Client, Pool } = require('pg')
const { PG_CONFIG, salt } = require('./configs.js')
const bcryptjs = require('bcryptjs')

const client1 = new Client(PG_CONFIG())
const client2 = new Client(PG_CONFIG('ofisapi'))
const client3 = new Client(PG_CONFIG('ofisapi'))
const client4 = new Client(PG_CONFIG('ofisapi'))

const hashPass = (pass) => {
    return bcryptjs.hashSync(pass, salt)
}

const prepareDb = () => {
    return new Promise((resolve, reject) => {
        client1.connect()
            .then(() => {
                return client1.query(`DROP DATABASE IF EXISTS ofisapi;`)
            })
            .then(() => {
                return client1.query(`CREATE DATABASE ofisapi;`)
            })
            .then(() => {
                return client2.connect()
            })
            .then(() => {
                return client2.query(`
            CREATE TABLE users(
                user_id INT GENERATED ALWAYS AS IDENTITY,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(140) NOT NULL,
                tasks VARCHAR(500),
                UNIQUE (username),
                PRIMARY KEY (user_id));
            `)
            })
            .finally(() => {
                client1.end()
                client2.end()
                resolve()
            })
    })
}

const populateTable = () => {
    client3.connect()
        .then(() => {
            return client3.query(`
            INSERT INTO users(username, password, tasks)
            VALUES 
            ('bsafarli', '${hashPass('safar123')}', 'makesandwich'),
            ('jerry', '${hashPass('jeki99')}', 'dodishes'),
            ('samir', '${hashPass('sako0')}', 'completetests');
        `)
        })
}

// populate table function()
// select users from function()

module.exports = {
    prepareDb: prepareDb,
    populateTable
}