var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
// Webkit/blink browsers need prefix, Safari won't work without window.

// var voiceSelect = document.getElementById("voice"); // select box for selecting voice effect options
// var visualSelect = document.getElementById("visual"); // select box for selecting audio visualization options
// var mute = document.querySelector('.mute'); // mute button
var drawVisual; // requestAnimationFrame

var analyser = audioCtx.createAnalyser();
var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var panNode = audioCtx.createStereoPanner();

let slider = require('./../demo-common/html/slider.js')(document.getElementById('canvas_div'), 'pan', 'pan')
slider.setList()

//
//
var PitchShift = function(ctx) {
    this.ctx = ctx;
    this.rate = 1.2;

    this.stream_length = 1024;
    // this.stream_length = 16384;
    this.pitchShifter = this.ctx.createScriptProcessor(this.stream_length, 1, 1);
    this.pitchShifter.onaudioprocess = this.onaudioprocess.bind(this);
    // this.fft = new FFT(this.stream_length, this.ctx.sampleRate);
    this.fft = require('./fft.js')(this.stream_length, this.ctx.sampleRate)
    // this.hann = new WindowFunction(DSP.HANN);
    this.a_real = new Array(this.stream_length);
    this.a_imag = new Array(this.stream_length);
    this.t = 0
};
PitchShift.prototype = {
    getSrc: function() {
        return this.pitchShifter;
    },
    connect: function(node) {
        this.pitchShifter.connect(node);
    },
    off: function() {
        this.rate = 1;
    },
    togglePitch: function() {
        if (this.rate == 0) this.rate = 0.7;
        this.rate = (2.0 + 0.7) - this.rate;
    },
    pshift: function(val, indata) {
        this.fft.forward(indata);
        for (var i = 0; i < this.stream_length; i++) {
            this.a_real[i] = 0;
            this.a_imag[i] = 0;
        }
        for (var i = 0; i < this.stream_length; i++) {
            var index = parseInt(i * val);
            var eq = 1.0;
            if (i > this.stream_length / 2) {
                eq = 0;
            }
            if ((index >= 0) && (index < this.stream_length)) {
                this.a_real[index] += this.fft.real[i] * eq;
                this.a_imag[index] += this.fft.imag[i] * eq;
            }
        }
        return this.fft.inverse(this.a_real, this.a_imag);
    },
    onaudioprocess: function(event) {
        let value = slider.getValues()[0]
        panNode.pan.value = value/100
        console.log(panNode.pan.value)

        var inputL = event.inputBuffer.getChannelData(0);
        var outputL = event.outputBuffer.getChannelData(0);
        // var inputR = event.inputBuffer.getChannelData(1);
        // var outputR = event.outputBuffer.getChannelData(1);
        this.rate = 1.0 + panNode.pan.value * 0.3
        var dataL = this.pshift(this.rate, inputL); // 1.0:normal  2.0:1oct up  0.5:1oct down
        // var dataR = this.pshift(this.rate, inputR); // 1.0:normal  2.0:1oct up  0.5:1oct down
        for (var i = 0; i < inputL.length; i++) {
            outputL[i] = dataL[i];
        }
        // for (var i = 0; i < inputR.length; i++) {
        //     inputR[i] = dataR[i];
        // }
        // console.log(event.outputBuffer)
        this.t++
        // console.log(slider.getValues())
    }
};

var pitchShift = new PitchShift(audioCtx);






function makeDistortionCurve(amount) { // function to make curve shape for distortion/wave shaper node to use
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for (; i < n_samples; ++i) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
};

navigator.mediaDevices.getUserMedia({
        audio: true
    })
    .then((stream) => {
        console.log('getUserMedia')

        source = audioCtx.createMediaStreamSource(stream);
        // source.connect(analyser)
        // analyser.connect(distortion)
        // distortion.connect(biquadFilter)
        // biquadFilter.connect(gainNode)
        // // gainNode.connect(audioCtx.destination); // connecting the different audio graph nodes together

        source.connect(pitchShift.getSrc())
        pitchShift.connect(panNode)
        panNode.connect(audioCtx.destination)


        // visualize(stream);
        // voiceChange();
    })
    .catch((err) => {
        console.log('The following gUM error occured: ' + err)
    })

function visualize(stream) {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    var visualSetting = "sinewave";
    console.log(visualSetting);

    if (visualSetting == "sinewave") {
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount; // half the FFT value
        var dataArray = new Uint8Array(bufferLength); // create an array to store the data

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        function draw() {

            drawVisual = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray); // get waveform data and put it into the array created above

            canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // draw wave with canvas
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * HEIGHT / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        draw();

    } else if (visualSetting == "off") {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.fillStyle = "red";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    }

}

function voiceChange() {
    distortion.curve = new Float32Array;
    biquadFilter.gain.value = 0; // reset the effects each time the voiceChange function is run

    var voiceSetting = "biquad";
    console.log(voiceSetting);

    if (voiceSetting == "distortion") {
        distortion.curve = makeDistortionCurve(400); // apply distortion to sound using waveshaper node
    } else if (voiceSetting == "biquad") {
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 25; // apply lowshelf filter to sounds using biquad
    } else if (voiceSetting == "off") {
        console.log("Voice settings turned off"); // do nothing, as off option was chosen
    }

}

// event listeners to change visualize and voice settings

// visualSelect.onchange = function() {
//     window.cancelAnimationFrame(drawVisual);
//     visualize(stream);
// }
//
// voiceSelect.onchange = function() {
//     voiceChange();
// }

// mute.onclick = voiceMute;

function voiceMute() { // toggle to mute and unmute sound
    // if (mute.id == "") {
    //     gainNode.gain.value = 0; // gain set to 0 to mute sound
    //     mute.id = "activated";
    //     mute.innerHTML = "Unmute";
    // } else {
    //     gainNode.gain.value = 1; // gain set to 1 to unmute sound
    //     mute.id = "";
    //     mute.innerHTML = "Mute";
    // }
}
