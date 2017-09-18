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

let isAR = false
let client
let sound

/**
 * Use the `getARDisplay()` utility to leverage the WebVR API
 * to see if there are any AR-capable WebVR VRDisplays. Returns
 * a valid display if found. Otherwise, display the unsupported
 * browser message.
 */

exports.start = (_client, _sound) => {
    client = _client
    sound = _sound
    THREE.ARUtils.getARDisplay().then(function(display) {
        if (display) {
            isAR = true
            vrFrameData = new VRFrameData()
            vrDisplay = display
            init()
            client.log('Device: ' + vrDisplay.displayName)
        } else {
            // THREE.ARUtils.displayUnsupportedMessage()
            client.log('This device can not use webAR')
            require('./protoVR.js').initVR(client, sound)
        }
    })
}

function init() {
    // Turn on the debugging panel
    let arDebug = new THREE.ARDebug(vrDisplay)
    document.body.appendChild(arDebug.getElement())

    // Setup the three.js rendering environment
    renderer = new THREE.WebGLRenderer({
        alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.autoClear = false
    canvas = renderer.domElement
    document.body.appendChild(canvas)
    document.body.appendChild(stats.domElement)

    // step.2 scene
    scene = new THREE.Scene()

    // Creating the ARView, which is the object that handles
    // the rendering of the camera stream behind the three.js
    // scene
    arView = new THREE.ARView(vrDisplay, renderer)

    // The ARPerspectiveCamera is very similar to THREE.PerspectiveCamera,
    // except when using an AR-capable browser, the camera uses
    // the projection matrix provided from the device, so that the
    // perspective camera's depth planes and field of view matches
    // the physical camera on the device.
    // step.3 camera
    camera = new THREE.ARPerspectiveCamera(
        vrDisplay,
        60,
        window.innerWidth / window.innerHeight,
        vrDisplay.depthNear,
        vrDisplay.depthFar
    )


    // VRControls is a utility from three.js that applies the device's
    // orientation/position to the perspective camera, keeping our
    // real world and virtual world in sync.
    vrControls = new THREE.VRControls(camera)

    // step.4 mesh
    initMesh()

    // Bind our event handlers
    window.addEventListener('resize', onWindowResize, false)
    canvas.addEventListener('touchstart', onClick, false)
    // canvas.addEventListener('click', onClick, false)

    // Kick off the render loop!
    update()
}

function initMesh() {
    cube = MeshProto.group()
    cube.scale.set(0.05, 0.05, 0.05)
    cube.position.set(0, 0, -0.5)
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
            p[Date.now() + 10] = position
            syncAudio.update(p)
        }
    })

    client.sendSyncObject({
        time: Date.now(),
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        events: {
            clientPosition: true,
            buffer: true
        },
        clientData: true
    })
}

/**
 * The render loop, called once per frame. Handles updating
 * our scene and rendering.
 */
let startTime = null

function update(time) {
    if (!time) {
        if (!startTime) {
            startTime = Date.now()
        }
        time = Date.now() - startTime
    }

    // Render the device's camera stream on screen first of all.
    // It allows to get the right pose synchronized with the right frame.
    arView.render()

    // Update our camera projection matrix in the event that
    // the near or far planes have updated
    camera.updateProjectionMatrix()

    // From the WebVR API, populate `vrFrameData` with
    // updated information for the frame
    vrDisplay.getFrameData(vrFrameData)

    // Update our perspective camera's positioning
    vrControls.update()


    // Render our three.js virtual scene
    renderer.clearDepth()

    eventCall.emit('animation', time)
    stats.update()


    renderer.render(scene, camera)

    // Kick off the requestAnimationFrame to call this function
    // on the next frame
    requestAnimationFrame(update)

    // client.log('develop/', vrDisplay)
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

/**
 * When clicking on the screen, create a cube at the user's
 * current position.
 */
function onClick() {
    sound.play('pizz_7')
    // Fetch the pose data from the current frame
    let pose = vrFrameData.pose

    // Convert the pose orientation and position into
    // THREE.Quaternion and THREE.Vector3 respectively
    let ori = new THREE.Quaternion(
        pose.orientation[0],
        pose.orientation[1],
        pose.orientation[2],
        pose.orientation[3]
    )

    let pos = new THREE.Vector3(
        pose.position[0],
        pose.position[1],
        pose.position[2]
    )

    let dirMtx = new THREE.Matrix4()
    dirMtx.makeRotationFromQuaternion(ori)

    let push = new THREE.Vector3(0, 0, -1.0)
    push.transformDirection(dirMtx)
    pos.addScaledVector(push, 0.125)

    // Clone our cube object and place it at the camera's
    // current position
    let clone = cube.clone()
    scene.add(clone)
    clone.position.copy(pos)
    clone.quaternion.copy(ori)

}
