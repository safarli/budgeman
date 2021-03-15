const { Client, Pool } = require('pg')
const { PG_CONFIG } = require('./configs.js')

const client1 = new Client(PG_CONFIG())
const client2 = new Client(PG_CONFIG('ofisapi'))
const client3 = new Client(PG_CONFIG('ofisapi'))
const client4 = new Client(PG_CONFIG('ofisapi'))

const prepareDb = async () => {
    try {
        await client1.connect()
        await client1.query(`DROP DATABASE IF EXISTS ofisapi WITH (FORCE);`)
        await client1.query(`CREATE DATABASE ofisapi`)

        await client2.connect()
        await client2.query(`
        CREATE TABLE users(
            user_id INT GENERATED ALWAYS AS IDENTITY,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(140) NOT NULL,
            PRIMARY KEY (user_id));`)
    } catch (e) {
        console.log(`Error catched: ${e}`)
    } finally {
        console.log('called')
        await client1.end()
        await client2.end()
    }
}

const populateTable = async () => {
    try {
        await client3.connect()
        await client3.query(`INSERT INTO users(username, password) VALUES ('safarli', 'ben123'), ('berry', 'lokke22');`)
    } catch (e) {
        console.log(`1 - ERROR OCCURED ${e}`)
    } finally {
        await client3.end()
    }
}

const getUser = async (username) => {
    try {
        await client4.connect()
        const { rows } = await client4.query(`SELECT * FROM users WHERE username=$1`, [username])
        console.log(rows)
    } catch (e) {
        console.log(`2 - ERROR OCCURED ${e}`)
    } finally {
        await client4.end()
    }
}

function tester() {
    setTimeout(() => console.log('ss'), 4000)
    return 555
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve('rezolviddd')
    //     }, 3000);
    // })
}

console.log(tester())

module.exports = {
    prepareDb: prepareDb
}