const { Client, Pool } = require('pg')
const { PG_CONFIG, salt } = require('./configs.js')
const bcryptjs = require('bcryptjs')

const client1 = new Client(PG_CONFIG())
const client2 = new Client(PG_CONFIG('ofisapi'))
const client3 = new Client(PG_CONFIG('ofisapi'))

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
                    UNIQUE (username),
                    PRIMARY KEY (user_id));
            `)
            })
            .then(() => {
                return client2.query(`
                CREATE TABLE user_tasks(
                    task_id INT GENERATED ALWAYS AS IDENTITY,
                    task VARCHAR(300) NOT NULL,
                    user_id INT NOT NULL,
                    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (task_id),
                    CONSTRAINT userid_fkey FOREIGN KEY (user_id) REFERENCES users(user_id));
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
            INSERT INTO users(username, password)
            VALUES 
            ('bsafarli', '${hashPass('safar123')}'),
            ('jerry', '${hashPass('jeki99')}'),
            ('samir', '${hashPass('sako0')}');
        `)
        })
        .then(() => {
            return client3.query(`
                INSERT INTO user_tasks(task, user_id) VALUES
                ('Going to store', 3),
                ('Repair car', 3),
                ('Ask for job', 1),
                ('Count products', 3),
                ('Switch on heater', 2);
            `)
        })
}

module.exports = {
    prepareDb: prepareDb,
    populateTable
}