const {Worker} = require('worker_threads')

const workerFile = './worker1.js'
const worker1 = new Worker(workerFile)
worker1.on('message', (msg) => console.log(msg))