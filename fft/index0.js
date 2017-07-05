// sampleRate    : 16000  // audio sample rate
// threshold     : 0.5    // silence threshold (rec only)
// thresholdStart: null   // silence threshold to start recording, overrides threshold (rec only)
// thresholdEnd  : null   // silence threshold to end recording, overrides threshold (rec only)
// silence       : '1.0'  // seconds of silence before ending
// verbose       : false  // log info to the console
// recordProgram : 'rec'  // Defaults to 'rec' - also supports 'arecord' and 'sox'
// device        : null   // recording device (e.g.: 'plughw:1')

var record = require('node-record-lpcm16')
var fs = require('fs')
let audioLib = require('audiolib')

var file = fs.createWriteStream('test.wav', {
    encoding: 'binary'
})

let option = {
    sampleRate: '16000',
    threshold: 0,
    silence: '0.0',
    verbose: true
}

var dev = audioLib.Sink(function(){
	// Fill the buffer here.
});

//　SpeakerRecognition
// Container	WAV
// Encoding	PCM
// Rate	16K
// Sample Format	16 bit
// Channels	Mono

// // To start
// record.start(option)
//     .pipe(file)

record.start(option).pipe(dev)

var flt = audioLib.LP12Filter(16000)
console.log(fit)

// To stop after 3s
setTimeout(function() {
    record.stop()
    console.log(record)
}, 1000)
//

// wit.ai
//
// var rec = require('node-record-lpcm16')
// var request = require('request')
// //
// var witToken = process.env.WIT_TOKEN || 'WDZM32H3QTFOGHH7SJEN7ABSMZW7E3C2'
// //
// exports.parseResult = function (err, resp, body) {
//   console.log(body)
// }
// //
// record.start().pipe(request.post({
//   'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
//   'headers' : {
//     'Accept'        : 'application/vnd.wit.20170307+json',
//     'Authorization' : 'Bearer ' + witToken,
//     'Content-Type'  : 'audio/wav'
//   }
// }, exports.parseResult))
