var request = require('request')
var sendTime = Date.now()
let dateDiff = 0

request.get('https://ntp-a1.nict.go.jp/cgi-bin/json', (err, res, body) => {
    return
    if(err || !body){
        return
    }
    body = JSON.parse(body)

    let endTime = Date.now()
    console.log("latency: " + (endTime - sendTime) / 2 + "ms")
    console.log(sendTime, body.st, endTime)
    dateDiff = body.st * 1000 + (endTime - sendTime) / 2 - endTime
    console.log("offset: " + dateDiff)
    reception_callback()
})

let isReception = false
let reception_callback = () => {}

module.exports = (callback = () => {}) => {
    if(isReception){
        callback(dateDiff)
    }else{
        reception_callback = () => {
            callback(dateDiff)
        }
    }
}
