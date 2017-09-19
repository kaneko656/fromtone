let vrDisplay
let vrFrameData
let vrControls
let arView

let canvas
let camera
let scene
let renderer
let cube
let box, wire
let width, height

let colors = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xffff00),
    new THREE.Color(0xff00ff),
    new THREE.Color(0xff0000),
    new THREE.Color(0x00ffff),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff),
    new THREE.Color(0x000000)
]

let property = require('./../webSocket/property')
let MeshProto = require('./proto-mesh.js')
let eventCall = require('./eventCall')

// view FPS  in update() write stats.update()
let Stats = require('./Stats.js')
let stats = new Stats()

let client
let sound

exports.initVR = (_client, _sound) => {
    client = _client
    sound = _sound

    width = window.innerWidth || 800
    height = window.innerHeight || 600

    // step.1 renderer
    renderer = new THREE.WebGLRenderer()
    // renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    // renderer.autoClear = false
    canvas = renderer.domElement
    document.body.appendChild(canvas)
    document.body.appendChild(stats.domElement)


    // step.2 scene
    scene = new THREE.Scene()

    // step.3 camera
    camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000)
    camera.position.set(0, 0, 1)
    // camera.zoom()


    // step.4 mesh
    initMesh()


    // step.5 light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
    directionalLight.position.set(0, 0, 0.5)
    scene.add(directionalLight)

    update()

    canvas.addEventListener('click', onClick, false)

}

function initMesh() {
    cube = MeshProto.group()
    cube.scale.set(0.05, 0.05, 0.05)
    cube.position.set(0, 0, -2)
    scene.add(cube)


    let localTime = Date.now()
    let syncStart = false
    let syncAudio
    setTimeout(() => {
        syncStart = true
    }, 10000)
    eventCall.on('animation', (operator, time) => {
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

        if(syncAudio){
            let p = {}
            p[Date.now() + 2] = position
            syncAudio.update(p)
        }
    })

    client.sendSyncObject({
        time: Date.now(),
        position: {
            x: 0,
            y: 0,
            z: -2
        },
        events: {
            clientPosition: true,
            buffer: true
        },
        clientData: true
    })
}

let startTime = null

function update(time) {
    time = null
    if (!time) {
        if (!startTime) {
            startTime = Date.now()
        }
        time = Date.now() - startTime
    }
    eventCall.emit('animation', time)
    stats.update()

    renderer.render(scene, camera)

    requestAnimationFrame(update)

}

function onClick() {
    // Fetch the pose data from the current frame

    // Convert the pose orientation and position into
    // THREE.Quaternion and THREE.Vector3 respectively
    let w = Math.random() - 0.5
    let h = Math.random() - 0.5
    let pos = new THREE.Vector3(w, h, -200)

    // Clone our cube object and place it at the camera's
    // current position
    let mesh = MeshProto.group()
    mesh.scale.set(0.05, 0.05, 0.05)
    mesh.position.set(w, h, -1)
    scene.add(mesh)

    let x = Math.random() / 10 - 0.05
    let y = Math.random() / 10 - 0.05

    update()

    function update() {
        requestAnimationFrame(update)
        mesh.rotation.x += 0.01 + x
        mesh.rotation.y += 0.01 + y

        // renderer.render(scene, camera)
    }
}

/**
 * On window resize, update the perspective camera's aspect ratio,
 * and call `updateProjectionMatrix` so that we can get the latest
 * projection matrix provided from the device
 */
function onWindowResize() {
    console.log('setRenderer size', window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
