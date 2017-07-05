// JSONファイルのdirectory
let json = __dirname + '/../../local-env/config.json'

// return
let env = {}

try{
  env = require(json)
  console.log("config.json",env)
}catch(e){}

module.exports = env
