// serverとwebsokcet通信を行う

const exCall = require('./../Call').exCall()
const call = require('./../Call').Call('exBot')
const config = require('./../config')

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

    this.conf = conf
    this.config = conf
    this.config.type = 'exbot_config'
    this.auth = {
        team: conf.team,
        pass: conf.pass
    }
    this.type = ''
    this.serviceObject = false
    this.exBot = null

    if (conf && conf.team && conf.username && conf.userpass) {
        this.auth.type = 'user'
    }
    if (conf && conf.team && conf.pass) {
        this.auth.type = 'team'
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

            let emit = this.exBot.emit
            this.exBot.emit = (...arg) => {
                arg.push(this.config)
                emit.apply(this, arg)
            }

            let on = this.exBot.on
            this.exBot.on = (...arg) => {
                arg.push(this.config)
                on.apply(this, arg)
            }

            console.log('callback', this.config)
            callback(this.exBot)


        }
    })

    // すでに受け取っている場合はそれを返す
    // userが実装されたら分けなければならない
    if (connected) {
        return
    }

    connected = true

    this.socket.Call().on('connect', () => {
        this.socket.emit('/exBot', this.auth)

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
    // let bot = this
    this.socket.Call().on('disconnect', function(){
        first = false
        // connect = false
    })

    this.socket.connect(this.targetUrl)

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
    return get(this.value, dir, option)
}

let get = (data, dir, option = '') => {
    let d = dir.split('.')
    let path = d.length >= 1 ? d[0] : null
    if (d.length == 1) {
        if (data && data[path]) {
            if (option == 'array') {
                let array = []
                let obj = data[path]
                for (let key in obj) {
                    if (isFinite(key)) {
                        array[key] = obj[key]
                    }
                }
                return returnArray(array)
            }
            return returnArray(data[path])
        } else {
            return returnArray(data)
        }
    }
    if (data && path && data[path]) {
        return get(data[path], dir.replace(path + '.', ''), option)
    } else {
        return false
    }
}

let returnArray = (obj) => {
    obj = returnArray2(obj)
    return obj
}

let returnArray2 = (obj) => {
    if (typeof obj == 'object') {
        let num = 0
        let isArray = true
        for (let key in obj) {
            if (String(num) != key) {
                isArray = false
            }
            if (typeof obj[key] == 'object') {
                obj[key] = returnArray2(obj[key])
            }
            num++
        }
        if (isArray) {
            let array = []
            for (let key in obj) {
                array.push(obj[key])
            }
            obj = array
        }
    }
    return obj
}
