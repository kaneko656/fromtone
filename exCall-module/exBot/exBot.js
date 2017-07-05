// serverとwebsokcet通信を行う

let modulePath = './../../exCall-module'
const exCall = require(modulePath + '/Call').exCall()
const call = require(modulePath + '/Call').Call('exBot')
const config = require(modulePath + '/config')

// socket
let Socket = require('./socket-client.js')()
// 別々に呼び出しても同じsocketでは一つに
let connected = false

module.exports = (conf) => {
    return new exBot(Socket, conf)
}

function exBot(Socket, conf) {

    this.serverUrl = config.SERVER_URL
    this.localUrl = 'http://localhost:' + config.PORT
    this.targetUrl = this.serverUrl
    this.socket = Socket

    this.config = conf
    this.type = ''
    this.serviceObject = false
    this.exBot = null

    if (conf && conf.team && conf.username && conf.userpass) {
        this.config.type = 'user'
    }
    if (conf && conf.team && conf.pass) {
        this.config.type = 'team'
    }
}

exBot.prototype.localTest = function() {
    this.targetUrl = this.localUrl
}

exBot.prototype.connect = function(callback = () => {}) {


    // 初回のみ受け取る
    let first = false
    exCall.addedFunctions((f) => {
        if (!first) {
            first = true
            this.exBot = f.functions
            callback(f.functions)

            // new
            if (typeof f.functions.updated == 'function') {
                f.functions.updated((value) => {
                    f.functions.value = value.val
                })
            }
            this.exBot.get = (dir, option) => {
                if (!typeof dir == 'string' && f.functions.value) {
                    return
                }
                dir = dir.split('/').join('.')
                return get(f.functions.value, dir, option)
            }
        }
    })

    // すでに受け取っている場合はそれを返す
    // userが実装されたら分けなければならない
    if (connected) {
        if (this.Bot) {
            callback(this.exBot)
        }
        return
    }

    connected = true


    this.socket.connect(this.targetUrl)

    this.socket.Call().on('connect', () => {
        this.socket.emit('/exBot', this.config)

        // こちらからセットする　未実装
        if (this.config.type == 'service') {
            exCall.setFunctions(this.serviceObject, {
                name: this.config.team
            })
        }
    })

    // Temple sentence for using exCall
    this.socket.open('/exCall')
    this.socket.Call().on('/exCall', (operator, res, obj) => {
        exCall.receiver(obj)
    })
    exCall.sender((obj) => {
        this.socket.emit('/exCall', obj)
    })

    // disconnect
    this.socket.Call().on('disconnect', () => {
        first = false
        // connect = false
    })
}


exBot.prototype.getFunctions = function() {
    return exCall.getFunctions()
}

exBot.prototype.addedFuntions = function(callback = () => {}) {

}


exBot.prototype.get = function(dir, option) {
    if (!typeof dir == 'string' && this.Data && this.Data.value) {
        return
    }
    dir = dir.split('/').join('.')
    return get(this.Data.value.val, dir, option)
}

let get = (data, dir, option = '') => {
    let d = dir.split('.')
    if (d.length == 1) {
        if (data && data[d[0]]) {
            if (option == 'array') {
                let array = []
                let obj = data[d[0]]
                for (let key in obj) {
                    if (isFinite(key)) {
                        array[key] = obj[key]
                    }
                }
                return array
            }
            return data[d[0]]
        } else {
            return false
        }
    }
    if (data && data[d[0]]) {
        return get(data[d[0]], dir.replace(d[0] + '.', ''), option)
    } else {
        return false
    }
}
