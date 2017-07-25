exports.create = (context, destination) => {

    // Create the instance of OscillatorNode
    // var oscillator = context.createOscillator() // for Input
    // for legacy browsers
    // oscillator.start = oscillator.start || oscillator.noteOn
    // oscillator.stop = oscillator.stop || oscillator.noteOff
    // Create the instance of BiquadFilterNode
    var bass = context.createBiquadFilter()
    var middle = context.createBiquadFilter()
    var treble = context.createBiquadFilter()
    // Set type
    bass.type = (typeof bass.type === 'string') ? 'lowshelf' : 3
    middle.type = (typeof middle.type === 'string') ? 'peaking' : 5
    treble.type = (typeof treble.type === 'string') ? 'highshelf' : 4

    bass.frequency.value = 1500 //  500 Hz
    middle.frequency.value = 3000 // 1000 Hz
    treble.frequency.value = 6000 // 2000 Hz

    // Set Q (Quality Factor)
    // bass.Q.value   = Math.SQRT1_2;  // Not used
    middle.Q.value = Math.SQRT1_2
    // treble.Q.value = Math.SQRT1_2;  // Not used

    // Connect nodes for effect (Equalizer) sound
    // OscillatorNode (Input) -> BiquadFilterNode (Bass -> Middle -> Treble) -> AudioDestinationNode (Output)
    // oscillator.connect(bass)
    bass.connect(middle)
    middle.connect(treble)
    treble.connect(destination)
    // Start sound
    // oscillator.start(0)

    bass.gain.value = 0 // + 18dB (boost)
    middle.gain.value = 23 // - 18dB (cut)
    treble.gain.value = 4 // + 18dB (boost)

    return bass
}
