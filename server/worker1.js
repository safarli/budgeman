
const { parentPort } = require('worker_threads')

let fruits = [
    'alma',
    'heyva',
    'nar',
    'banan',
    'portagal'
]

let x = 1

for (let f of fruits) {
    setTimeout(
        () => parentPort.postMessage(f), 1000 * x
    )
    x++
}