const io = require('socket.io-client')
const uuid = require('node-uuid')



module.exports = () => {
    return new Socket()
}

function Socket(){
  this.Caller = require('./../../exCall-module/Call').Call('socket')
  this.internalCall = require('./../../exCall-module/Call').Call('socket_internal')
  this.openObj = {}


  let Call = this.Caller
  let internalCall = this.internalCall
  let open = this.openObj

  Call.noticeEmit('connect').noticeEmit('disconnect')

  internalCall.on('connect', (operator, targetUrl) => {
      let socket = io.connect(targetUrl)

      socket.on('connect', () => {
          Call.emit('connect')
      })

      // disconnect
      socket.on('disconnect', () => {
          Call.emit('disconnect')
      })

      // open
      for (let dir in open) {
          socket.on(dir, (obj) => {
              Call.emit(dir, resObj(socket, obj.uuid), obj)
          })
      }

      // openEvent
      internalCall.on('open', (operator, dir) => {
          socket.on(dir, (body) => {
              Call.emit(dir, resObj(), body)
          })
      })

      // emit
      internalCall.on('emit', (operator, key, body = {}, callback = () => {}) => {
          let uuid_v4 = uuid.v4()
          let obj = {}
          obj.uuid = uuid_v4
          obj.body = body
          socket.emit(key, obj)
          socket.once(uuid_v4, (res) => {
              callback(res)
          })
      })
  })


  let consoleLog = () => {

      internalCall.on('connect', (operator, targetUrl) => {
          console.log('connecting...', targetUrl)
      })

      internalCall.on('open', (operator, ...arg) => {
          console.log('open', arg)
      })

      internalCall.on('emit', (operator, ...arg) => {
          //console.log('emit', arg)
      })


      Call.on('connect', () => {
          console.log('connect!')
      })

      Call.on('disconnect', () => {
          console.log('disconnect!')
          console.log('connecting...  ')
      })
  }

  // comment out to off
  consoleLog()
}

Socket.prototype.Call = function(){
    return this.Caller
}

Socket.prototype.open = function(dir) {
    this.openObj[dir] = {
        dir: dir
    }
    this.internalCall.emit('open', dir)
}

Socket.prototype.emit = function(key, body = {}, callback = () => {}){
    this.internalCall.emit('emit', key, body, callback)
}


Socket.prototype.connect = function(targetUrl){
    this.internalCall.emit('connect', targetUrl)
}

let resObj = (socket, uuid) => {
    return {
        send: (body) => {
            socket.emit(uuid, body)
        },
        finished: () => {
            return false
        },
        desist: () => {
            uuid = null
        }
    }
}
