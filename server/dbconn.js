const { Client, Pool } = require('pg')
const { PG_CONFIG } = require('./configs.js')

const client1 = new Client(PG_CONFIG())
const client2 = new Client(PG_CONFIG('ofisapi'))
const client3 = new Client(PG_CONFIG('ofisapi'))
const client4 = new Client(PG_CONFIG('ofisapi'))

const prepareDb = () => {
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
                PRIMARY KEY (user_id));
            `)
        })
        .finally(() => {
            client1.end()
            client2.end()
        })
}

const populateTable = () => {
    client3.connect()
    .then(() => {
        return client3.query(`
            INSERT INTO users(username, password)
            VALUES ('bsafarli', 'hafu8234ahg5je'),
            ('jerry', 'jtg73h4jo9fb1'),
            ('samir', 'hreg73291jf5b2jfabb')
        `)
    })
}



// populate table function()
// select users from function()

module.exports = {
    prepareDb: prepareDb
}