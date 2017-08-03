// let Voice = require('./createVoice.js')('d0vkda03h31rw8yb')

let socketDir = 'demo_chat_'

exports.start = (context, socket) => {

    //
    // window.AudioContext = window.AudioContext || window.webkitAudioContext
    // context = new AudioContext()
    //

    console.log('start')

    let body = {
        text: 'こんにちは'
    }

    socket.emit(socketDir + 'voicetext', body)

    socket.on(socketDir + 'voicetext', (buffer) => {
        console.log(buffer)
        context.decodeAudioData(buffer, function(decodedBuffer) {
            decodedBuffer

            // source
            let source = context.createBufferSource()
            source.buffer = decodedBuffer
            // source.connect(context.destination)
            // source.start()

            // source 音源　から　出力までの経路をconnectで繋いで行く

            // gain
            let gainNode = context.createGain()
            gainNode.gain.value = 1.0

            // connect
            gainNode.connect(context.destination)
            source.connect(gainNode)
            console.log(source)

            // source 音源　から　source -> gain -> destinationまでの経路をconnectで繋いで行く

            // setTimeout(()=>{
            //   gainNode.gain.value = 0.5
            // },500)

            // sec
            let startTime = context.currentTime
            source.start(startTime)

            console.log(startTime)
            gainNode.gain.linearRampToValueAtTime(0, startTime + 0.5)
            gainNode.gain.linearRampToValueAtTime(1, startTime + source.buffer.duration)


        }, (err) => {
            console.log(err)
        })
    })
}
