var context;
window.addEventListener('load', init, false);

function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    } catch (e) {
        alert('Web Audio API is not supported in this browser');
    }
}


// 小〜中規模の音をロード
let dogBarkingBuffer = null

function loadDogSound(url) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            dogBarkingBuffer = buffer
        }, onError)
    }
    request.send()
}

function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer; // tell the source which sound to play
    source.connect(context.destination); // connect the source to the context's destination (the speakers)
    source.start(0); // play the source now
    // note: on older systems, may have to use deprecated noteOn(time)
    //  noteOn(time)関数は正確なタイミングでの音声の再生
}

window.webkitAudioContext;
context = new AudioContext();

bufferLoader = new BufferLoader(
    context, [
        'lib/sound/melodius-scale-piano-C3.wav',
        'lib/sound/melodius-scale-piano-D3.wav',
        'lib/sound/melodius-scale-piano-E3.wav',
        'lib/sound/melodius-scale-piano-F3.wav'
    ],
    finishedLoading
)

let setSource = (name, dir) => {
    fs.readFile(dir, function(err, buf) {
        if (err) throw err
        context.decodeAudioData(buf, (_buffer) => {
            buffer[name] = _buffer
        })
    })
}

bufferLoader.load();
}

function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    var source2 = context.createBufferSource();
    source1.buffer = bufferList[0];
    source2.buffer = bufferList[1];

    source1.connect(context.destination);
    source2.connect(context.destination);
    source1.start(0);
    source2.start(0);
}

function rhythmTrack() {
    for (var bar = 0; bar < 2; bar++) {
        var time = startTime + bar * 8 * eighthNoteTime;
        // Play the bass (kick) drum on beats 1, 5
        playSound(kick, time);
        playSound(kick, time + 4 * eighthNoteTime);

        // Play the snare drum on beats 3, 7
        playSound(snare, time + 2 * eighthNoteTime);
        playSound(snare, time + 6 * eighthNoteTime);

        // Play the hi-hat every eighth note.
        for (var i = 0; i < 8; ++i) {
            playSound(hihat, time + i * eighthNoteTime);
        }
    }
}

function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}

// Volume
// Create a gain node.
var gainNode = context.createGain();
// Connect the source to the gain node.
source.connect(gainNode);
// Connect the gain node to the destination.
gainNode.connect(context.destination);

// Reduce the volume.
gainNode.gain.value = 0.5;

// ２つの音源　クロスフェード
function createSource(buffer) {
  var source = context.createBufferSource();
  // Create a gain node.
  var gainNode = context.createGain();
  source.buffer = buffer;
  // Turn on looping.
  source.loop = true;
  // Connect source to gain.
  source.connect(gainNode);
  // Connect gain to destination.
  gainNode.connect(context.destination);

  return {
    source: source,
    gainNode: gainNode
  };
}

// 曲の終わりで制御　あらかじめAtTimeを設定
function playHelper(bufferNow, bufferLater) {
  var playNow = createSource(bufferNow);
  var source = playNow.source;
  var gainNode = playNow.gainNode;
  var duration = bufferNow.duration;
  var currTime = context.currentTime;
  // Fade the playNow track in.
  gainNode.gain.linearRampToValueAtTime(0, currTime);
  gainNode.gain.linearRampToValueAtTime(1, currTime + ctx.FADE_TIME);
  // Play the playNow track.
  source.start(0);
  // At the end of the track, fade it out.
  gainNode.gain.linearRampToValueAtTime(1, currTime + duration-ctx.FADE_TIME);
  gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
  // Schedule a recursive track change with the tracks swapped.
  var recurse = arguments.callee;
  ctx.timer = setTimeout(function() {
    recurse(bufferLater, bufferNow);
  }, (duration - ctx.FADE_TIME) * 1000);
}

// Filter
// Low pass filter
// High pass filter
// Band pass filter
// Low shelf filter
// High shelf filter
// Peaking filter
// Notch filter
// All pass filter
// Create the filter
var filter = context.createBiquadFilter();
// Create the audio graph.
source.connect(filter);
filter.connect(context.destination);
// Create and specify parameters for the low-pass filter.
filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
filter.frequency.value = 440; // Set cutoff to 440 HZ
// Playback the sound.
source.start(0);

// Disconnect the source and filter.
// source.disconnect(0);
// filter.disconnect(0);
// // Connect the source directly.
// source.connect(context.destination);
