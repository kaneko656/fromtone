let AudioContext = require('./web-audio-api').AudioContext
let context = new AudioContext()

let startTime = Date.now()
let Speaker = require('speaker')
//
context.outStream = new Speaker({
    channels: context.format.numberOfChannels,
    bitDepth: context.format.bitDepth,
    sampleRate: context.sampleRate
})

// 標準出力に出す ターミナル？
// context.outStream = process.stdout

const fs = require('fs')

let buffer = {}
let source = {}

let panner = context.createPanner()
panner.connect(context.destination)
console.log(panner)
let pos = (value) => {
    setTimeout(() => {
        value += 1
        // panner._position.x = Math.sin(value / 4)
        panner.setPosition(Math.sin(value / 4), 0, 0)
        panner.setOrientation(0, 1, 0)
        panner._panningModel=1;
        pos(value)
        console.log(panner)
        console.log(Math.sin(value / 4))
    }, 300)
}
pos(0)


let load = () => {

    setSource('C3', '../../sound/melodius-scale-piano-C3.wav')
    setSource('D3', '../../sound/melodius-scale-piano-D3.wav')
    setSource('E3', '../../sound/melodius-scale-piano-E3.wav')
    setSource('F3', '../../sound/melodius-scale-piano-F3.wav')

    setTimeout(() => {
        console.log('start')
        let time = (Date.now() - startTime) / 1000
        playSound(buffer['C3'], 0.1 + time)
        playSound(buffer['D3'], 0.5 + time)
        playSound(buffer['E3'], 1.0 + time)
        playSound(buffer['F3'], 1.5 + time)
        // playSound(buffer['F3'], 3 + time)
        //
        // playSound(buffer['C3'], 4 + time)
        // playSound(buffer['F3'], 4 + time)

    }, 2000)

}

let setSource = (name, dir) => {
    fs.readFile(dir, function(err, buf) {
        if (err) throw err
        context.decodeAudioData(buf, (_buffer) => {
            buffer[name] = _buffer
        })
    })
}

let playSound = (buffer, time) => {
    var source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.loop = true
    source.start(time)
}

console.log(context)
for (let key in context) {
    console.log(key)

}


// //
// let finishedLoading = () => {
//
//     // Create two sources and play them both together.
//     var source1 = context.createBufferSource();
//     var source2 = context.createBufferSource();
//     source1.buffer = bufferList[0];
//     source2.buffer = bufferList[1];
//
//     source1.connect(context.destination);
//     source2.connect(context.destination);
//     source1.start(0);
//     source2.start(0);
//     console.log('start')
//
// }

load()
