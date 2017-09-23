let vrDisplay
let vrFrameData
let vrControls
let arView

let canvas
let camera
let scene
let controls
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
setTimeout(() => {
    document.body.appendChild(stats.domElement)
}, 1000)
let client
let sound
let deviceMesh = {}

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


    // step.2 scene
    scene = new THREE.Scene()

    // step.3 camera
    camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000)
    camera.position.set(0, 0, 0.5)
    // camera.zoom(2)

    // step.3.1
    controls = new THREE.OrbitControls(camera, canvas)

    // step.4 mesh
    initMesh()


    // step.5 light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
    directionalLight.position.set(0, 0, 0.5)
    scene.add(directionalLight)

    update()

    canvas.addEventListener('click', onClick, false)
    window.addEventListener('resize', onWindowResize, false)

    hitting()

}

function hitting() {
    // THREE.SceneUtils.traverseHierarchy( object, function ( object ) { object.visible = false; } );
    var geometry = new THREE.PlaneGeometry(0.1, 0.1) // width, height, widthSegments, heightSegments
    var material = new THREE.MeshBasicMaterial({
        color: 0x45ff45,
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material)
    plane.position.set(0, 0, 0)
    plane.rotation.set(Math.PI/2,0,0)

    plane.visible = true
    scene.add(plane)
}

function initMesh() {

    // VR/AR
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

        // console.log(toScreen(cube.position))
        // toScreen(cube.position)
        function toScreen(position) {
            let widthHalf = window.innerWidth / 2
            let heightHalf = window.innerWidth / 2

            var sPos = position.clone()
            sPos.project(camera)
            sPos.x = (sPos.x * widthHalf) + widthHalf
            sPos.y = -(sPos.y * heightHalf) + heightHalf
            sPos.z = 0
            return sPos
        }

        if (syncAudio) {
            let p = {}
            p[Date.now() + 2] = position
            syncAudio.update(p)
        }
    })

    // only VR  positionを共有しない
    // client.send.position({
    //     id: client.data.user,
    //     position: {
    //         x: -0.1,
    //         y: 0,
    //         z: 0
    //     }
    // })

    // VR/AR
    // device Position
    client.receive.position((body) => {
        let id = body.id
        if (client.data.user == id) {
            return
        }
        if (!deviceMesh[id]) {
            let mesh = MeshProto.group()
            mesh.scale.set(0.05, 0.05, 0.03)
            mesh.position.copy(body.position)
            scene.add(mesh)
            deviceMesh[id] = mesh
        }
        deviceMesh[id].position.copy(body.position)
        if (body.orientation) {
            let quaternion = new THREE.Quaternion(
                body.orientation[0],
                body.orientation[1],
                body.orientation[2],
                body.orientation[3]
            )
            deviceMesh[id].quaternion.copy(quaternion)
        }
    })

    // only VR
    let center = cube.clone()
    scene.add(center)

    setTimeout(() => {
        let folder = client.gui.addFolder('position')
        console.log('folder', folder)

    }, 100)

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
    controls.update()
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
//
// let moveAccel = 0
// let moveVelocity = 0
// let moveAccelValue = 0.0002
// let lastTime = 0
//
// function keyDown(e) {
//     // keyCode キーに対応する番号
//     // shiftKey shiftキーの押下状態
//     // ctrlKey ctrlキーの押下状態
//     // altKey altキーの押下状態
//
//     // - 左 右　+
//     // - 下 上　+
//     // - 奥 前　+
//
//     // TODO Controlerを使う
//
//     // initial
//     if (Date.now() - lastTime > 100) {
//         moveAccel = 0
//         moveVelocity = 0
//         if (moveVelocity < 0.001) {
//             moveVelocity = 0
//         }
//     }
//     lastTime = Date.now()
//
//     moveAccel += moveAccelValue
//     moveVelocity += moveAccel
//     let moveValue = moveVelocity
//     // ← Left
//     if (e.keyCode == 37) {
//         camera.position.x -= moveValue
//     }
//     // ↑ UP
//     else if (e.keyCode == 38) {
//         camera.position.z -= moveValue
//     }
//     // → Right
//     else if (e.keyCode == 39) {
//         camera.position.x += moveValue
//     }
//     // ↓ Down
//     else if (e.keyCode == 40) {
//         camera.position.z += moveValue
//     }
//
//
//
//     console.log(e.keyCode)
//
// }
//


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
