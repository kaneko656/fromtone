
function initMesh() {
    cube = MeshProto.group()
    cube.scale.set(0.05, 0.05, 0.05)
    cube.position.set(0, 0, 0)
    scene.add(cube)

    let localTime = Date.now()
    let syncStart = false
    let syncAudio
    setTimeout(() => {
        syncStart = true
    }, 10000)
    eventEmitter.on('animation', (time) => {
        let st = property.get('startTime', null)
        // syncStart
        if (st && syncStart) {
            syncStart = false
            sound.finishLoad('pizz_melody', () => {
                syncAudio = sound.play('pizz_melody', {
                    offset: (Date.now() - st) / 1000,
                    loop: true
                })
                syncAudio.applyDBAP(true)
                syncAudio.finished = () => {
                    syncAudio = sound.play('pizz_melody', {
                        startDateTime: st
                    })
                }
            })
        }

        time = Date.now() - (st || localTime)
        let r = (Math.PI * 2 / 5000) * time
        let position = {
            x: Math.cos(r),
            y: 0,
            z: Math.sin(r) - 1
        }
        cube.rotation.x += 0.01
        cube.rotation.y = Math.cos(r) * Math.PI
        cube.position.copy(position)

        if (syncAudio) {
            let p = {}
            p[Date.now() + 10] = position
            syncAudio.update(p)
        }
    })
}
