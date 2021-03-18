// const { Worker } = require('worker_threads')

// const workerFile = './worker1.js'
// const worker1 = new Worker(workerFile)
// worker1.on('message', msg => console.log(msg))


let blue = true


const loopInterval = setInterval(
    () => {
        if (!blue) {
            clearInterval(loopInterval)
            return
        }
        console.log('Looping...')
    }, 700
)

setTimeout(
    () => {
        blue = !blue
    },
    6000
)
