let speakerList = {}

let noteClient = null
let tempNote = null

exports.start = (socket, disconnect, emitAllClient) => {

    let id = ''

    disconnect(() => {
        if (id === noteClient && tempNote) {
            tempNote.isOtherMove = false
            tempNote.ovre = false
            emitAllClient('syncmusic_surround_note', Object.assign({}, tempNote))
            noteClient = null
            tempNote = null
        }
        if (id in speakerList) {
            delete speakerList[id]
        }
    })

    socket.on('syncmusic_surround_speaker', (body) => {
        if (body.id && body.speaker) {
            speakerList[body.id] = body.speaker
            id = body.id
        }
        emitAllClient('syncmusic_surround_speaker', Object.assign({}, speakerList))
    })

    socket.on('syncmusic_surround_note_click', (body) => {
        if (!noteClient && body.id) {
            noteClient = body.id
            socket.emit('syncmusic_surround_note_click', body)
        }
    })

    socket.on('syncmusic_surround_note', (body) => {
        if (body.id && body.note) {
            if (body.id === noteClient) {
                emitAllClient('syncmusic_surround_note', Object.assign({}, body.note))
                tempNote = body.note
            }
        }
        let release = (body.note && typeof body.note.release != 'undefined') ? body.note.release : body.release
        if (release) {
            noteClient = null
        }
    })

    socket.on('syncmusic_surround_reset', (body) => {
        speakerList = {}
        noteClient = null
        tempNote = null
        console.log('reset')
    })
}
