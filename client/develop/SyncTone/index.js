let audioList = {
    '３音': 'lib/sound/notification-common.mp3',
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    'wind': 'lib/sound/wind8.mp3',
    'pizz_melody': 'lib/sound/pizz2_melody.mp3',
    'pizz_7': 'lib/sound/tone/pizz_C.mp3',
    'pizz_6': 'lib/sound/tone/pizz_D.mp3',
    'pizz_5': 'lib/sound/tone/pizz_E.mp3',
    'pizz_4': 'lib/sound/tone/pizz_F.mp3',
    'pizz_3': 'lib/sound/tone/pizz_G.mp3',
    'pizz_2': 'lib/sound/tone/pizz_A.mp3',
    'pizz_1': 'lib/sound/tone/pizz_B.mp3',
    'pizz_0': 'lib/sound/tone/pizz_hC.mp3',
    'marimba_7': 'lib/sound/tone/marimba_C.mp3',
    'marimba_6': 'lib/sound/tone/marimba_D.mp3',
    'marimba_5': 'lib/sound/tone/marimba_E.mp3',
    'marimba_4': 'lib/sound/tone/marimba_F.mp3',
    'marimba_3': 'lib/sound/tone/marimba_G.mp3',
    'marimba_2': 'lib/sound/tone/marimba_A.mp3',
    'marimba_1': 'lib/sound/tone/marimba_B.mp3',
    'marimba_0': 'lib/sound/tone/marimba_hC.mp3',
    'piano_7': 'lib/sound/tone/piano_C.mp3',
    'piano_6': 'lib/sound/tone/piano_D.mp3',
    'piano_5': 'lib/sound/tone/piano_E.mp3',
    'piano_4': 'lib/sound/tone/piano_F.mp3',
    'piano_3': 'lib/sound/tone/piano_G.mp3',
    'piano_2': 'lib/sound/tone/piano_A.mp3',
    'piano_1': 'lib/sound/tone/piano_B.mp3',
    'piano_0': 'lib/sound/tone/piano_hC.mp3',
    'guita_7': 'lib/sound/tone/guita_C.mp3',
    'guita_6': 'lib/sound/tone/guita_D.mp3',
    'guita_5': 'lib/sound/tone/guita_E.mp3',
    'guita_4': 'lib/sound/tone/guita_F.mp3',
    'guita_3': 'lib/sound/tone/guita_G.mp3',
    'guita_2': 'lib/sound/tone/guita_A.mp3',
    'guita_1': 'lib/sound/tone/guita_B.mp3',
    'guita_0': 'lib/sound/tone/guita_hC.mp3',
    'xylophone_7': 'lib/sound/tone/xylophone_C.mp3',
    'xylophone_6': 'lib/sound/tone/xylophone_D.mp3',
    'xylophone_5': 'lib/sound/tone/xylophone_E.mp3',
    'xylophone_4': 'lib/sound/tone/xylophone_F.mp3',
    'xylophone_3': 'lib/sound/tone/xylophone_G.mp3',
    'xylophone_2': 'lib/sound/tone/xylophone_A.mp3',
    'xylophone_1': 'lib/sound/tone/xylophone_B.mp3',
    'xylophone_0': 'lib/sound/tone/xylophone_hC.mp3'
}

let SoundManager = require('./SoundManager.js')

SoundManager.setAudioList(audioList)

SoundManager.setSpeakerPosition('a', {
    a: {
        x: 0.2,
        y: 0.2
    },
    b: {
        x: 0.7,
        y: 0.4
    }
})
let dbap = SoundManager.DBAP({
  x:0,
  y:0
})
console.log(dbap)
setTimeout(()=>{
    let audioSyncController = SoundManager.play('pizz_melody')
    console.log('play')
    audioSyncController.applyDBAP(true)
    audioSyncController.applyDoppler(true)
    let pos = {}
    for(let i=0; i<4; i++){
        pos[Date.now() + i * 1000] = {
            x: i/3,
            y: 0.2
        }
    }
    audioSyncController.update(pos)
    for(let i=4; i<7; i++){
        pos[Date.now() + i * 1000] = {
            x: 0.2,
            y: 0.2
        }
    }
    audioSyncController.update(pos)
}, 2500)
