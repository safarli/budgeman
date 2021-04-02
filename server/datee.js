
const pg = require('pg');

const pool = new pg.Pool({
    host: 'wavevo.com',
    port: 5432,
    user: 'postgres',
    database: 'ofisapi',
    password: 'gello99a3',
})

pool.query(`SELECT * FROM messages WHERE message_id = 5`)
    .then((result) => {
        const message = result.rows[0];
        const date = new Date(message.received_date);
        console.log(`
        Month: ${date.getUTCMonth()}
        Day: ${date.getUTCDate()}
        Year: ${date.getUTCFullYear()}
        Hour: ${date.getUTCHours()}
        Minutes: ${date.getUTCMinutes()}
        `)
        console.log(date)
        console.log(date.toLocaleString("az-az", {timeZone: 'Asia/Baku'}));
    })
    .catch(e => console.log(e))