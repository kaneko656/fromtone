
let config = {}

let local = require('./config-local.js')

config = process.env

for(let key in local){
    config[key] = process.env[key] || local[key]
}

module.exports = config
