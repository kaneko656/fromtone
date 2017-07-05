window.addEventListener('load', init, false);

let context
let buffer = {}
let loadBufferList = {
    'C3': 'lib/sound/melodius-scale-piano-C3.wav'
}
let panner

let sample = require('./sample-panner.js')

console.log('変更')

function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        context = new AudioContext()
        // panner = context.createPanner()
        console.log(context)

        sample(document.getElementById('canvas_div'), context)

        // context.listener.setPosition(0, 0, 0);
        //
        // panner.connect(context.destination)
        // panner.panningModel = 'HRTF'
        // console.log(panner)
        //
        // bufferLoad(loadBufferList, () => {
        //     console.log(buffer)
        //     playSound(buffer['C3'], 0)
        // })
        //
        // window.addEventListener('mousemove', mouseMoved, false);

    } catch (e) {
        alert('Web Audio API is not supported in this browser')
    }
}

function playSound(buffer, time = 0) {

    panner = context.createPanner()
    context.listener.setPosition(0, 0, 0);

    panner.panningModel = 'HRTF'
    panner.connect(context.destination)
    panner.coneOuterGain = 0.1;
    panner.coneOuterAngle = 180;
    panner.coneInnerAngle = 0;

    var source = context.createBufferSource()
    source.buffer = buffer
    source.connect(panner)
    source.loop = true
    source.start(time)
}


text = new AudioContext()



let bufferLoad = (urlList, callback = () => {}) => {
    let cnt = 0
    for (let name in loadBufferList) {
        let url = loadBufferList[name]
        loadSound(url, (buf) => {
            buffer[name] = buf

            cnt++
            if (cnt == Object.keys(loadBufferList).length) {
                callback()
            }
        })
    }
}

function loadSound(url, callback = () => {}) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = function() {
        console.log('load')
        context.decodeAudioData(request.response, function(buffer) {
            callback(buffer)
        }, (err) => {
            console.log(err)
        })
    }
    request.send()
}



var width = window.innerWidth;
var height = window.innerHeight;

var xPos = Math.floor(width / 2);
var yPos = Math.floor(height / 2);
var zPos = 295;

let changePosition = (value) => {
    setTimeout(() => {
        value += 1
        // panner._position.x = Math.sin(value / 4)
        changePosition(value)
        console.log(Math.sin(value / 4))
    }, 300)
}

let mouseMoved = (e) => {
    // console.log(e.clientX, e.clientY)
    panner.positionX = (e.clientX - xPos) / width * 1000
    panner.positionY = (e.clientY - yPos) / height * 1000
    console.log((e.clientX - xPos) / width * 1000, (e.clientY - yPos) / height * 1000)
}


// // Volume
// // Create a gain node.
// var gainNode = context.createGain();
// // Connect the source to the gain node.
// source.connect(gainNode);
// // Connect the gain node to the destination.
// gainNode.connect(context.destination);
//
// // Reduce the volume.
// gainNode.gain.value = 0.5;
//
// // ２つの音源　クロスフェード
// function createSource(buffer) {
//   var source = context.createBufferSource();
//   // Create a gain node.
//   var gainNode = context.createGain();
//   source.buffer = buffer;
//   // Turn on looping.
//   source.loop = true;
//   // Connect source to gain.
//   source.connect(gainNode);
//   // Connect gain to destination.
//   gainNode.connect(context.destination);
//
//   return {
//     source: source,
//     gainNode: gainNode
//   };
// }
//
// // 曲の終わりで制御　あらかじめAtTimeを設定
// function playHelper(bufferNow, bufferLater) {
//   var playNow = createSource(bufferNow);
//   var source = playNow.source;
//   var gainNode = playNow.gainNode;
//   var duration = bufferNow.duration;
//   var currTime = context.currentTime;
//   // Fade the playNow track in.
//   gainNode.gain.linearRampToValueAtTime(0, currTime);
//   gainNode.gain.linearRampToValueAtTime(1, currTime + ctx.FADE_TIME);
//   // Play the playNow track.
//   source.start(0);
//   // At the end of the track, fade it out.
//   gainNode.gain.linearRampToValueAtTime(1, currTime + duration-ctx.FADE_TIME);
//   gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
//   // Schedule a recursive track change with the tracks swapped.
//   var recurse = arguments.callee;
//   ctx.timer = setTimeout(function() {
//     recurse(bufferLater, bufferNow);
//   }, (duration - ctx.FADE_TIME) * 1000);
// }
//
// // Filter
// // Low pass filter
// // High pass filter
// // Band pass filter
// // Low shelf filter
// // High shelf filter
// // Peaking filter
// // Notch filter
// // All pass filter
// // Create the filter
// var filter = context.createBiquadFilter();
// // Create the audio graph.
// source.connect(filter);
// filter.connect(context.destination);
// // Create and specify parameters for the low-pass filter.
// filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
// filter.frequency.value = 440; // Set cutoff to 440 HZ
// // Playback the sound.
// source.start(0);

// Disconnect the source and filter.
// source.disconnect(0);
// filter.disconnect(0);
// // Connect the source directly.
// source.connect(context.destination);
