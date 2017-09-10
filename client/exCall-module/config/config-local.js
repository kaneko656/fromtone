// JSONファイルのdirectory
// let json = './../../local-env/config.json'
// return
let env = {}

try {
    env = require('./../../local-env/config.json')
} catch (e) {}

module.exports = env
