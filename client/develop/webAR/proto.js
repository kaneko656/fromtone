let vrDisplay
let vrFrameData
let vrControls
let arView

let canvas
let camera
let scene
let renderer
let cube
let box, wire, triangle
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
const events = require('events')
let eventEmitter = new events.EventEmitter()


// view FPS  in update() write stats.update()
let Stats = require('./Stats.js')
let stats = new Stats()

let isAR = false
let client
let sound
let deviceMesh = {}

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

            var nativeLog = console.log.bind(console) //store native function
            console.log = function(...arg) { //override
                nativeLog(arg[0])
                client.log(arg)
            }
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
    // let arDebug = new THREE.ARDebug(vrDisplay)
    // document.body.appendChild(arDebug.getElement())

    // Setup the three.js rendering environment
    renderer = new THREE.WebGLRenderer({
        alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.autoClear = false
    canvas = renderer.domElement
    document.body.appendChild(canvas)
    document.body.appendChild(stats.domElement)

    // step.2 scene
    scene = new THREE.Scene()

    // Creating the ARView, which is the object that handles
    // the rendering of the camera stream behind the three.js
    // scene
    arView = new THREE.ARView(vrDisplay, renderer)

    // let videoRenderer = new ARVideoRenderer(vrDisplay, renderer.context)
    // client.log(videoRenderer)

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
    // initMesh()
    initTriangle()
    //
    // // Bind our event handlers
    window.addEventListener('resize', onWindowResize, false)
    canvas.addEventListener('touchstart', onClick, false)
    // // canvas.addEventListener('click', onClick, false)
    //
    // // Kick off the render loop!
    update()
    //
    // client.log(vrFrameData.pose)
    //
    guiView()
    //
    setTimeout(() => {
        // hitting()
    }, 500)

    setTimeout(() => {
        // client.log(vrDisplay)
        // client.log(vrFrameData)
    }, 5000)

    canvas.addEventListener('touchmove', (e) => {
        client.send.position({
            id: client.data.user,
            position: {
                x: e.touches[0].pageX / window.innerWidth,
                y: e.touches[0].pageY / window.innerHeight,
                z: 0
            }
        })
    })

}

function initTriangle() {
    let material = new THREE.LineBasicMaterial({
        linewidth: 2,
        color: 0xcccc00
    })
    let geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(0, 0, 2 / 3))
    geometry.vertices.push(new THREE.Vector3(1 / 2, 0, -1 / 3))
    geometry.vertices.push(new THREE.Vector3(-1 / 2, 0, -1 / 3))
    geometry.vertices.push(new THREE.Vector3(0, 0, 2 / 3))
    triangle = new THREE.Line(geometry, material)
    triangle.scale.set(0.05, 0.05, 0.05)
}

let viewAnchorId = []

let anchorModel = new THREE.Matrix4()
let tempAnchorPos = new THREE.Vector3()
let tempAnchorQuat = new THREE.Quaternion()
let tempAnchorScale = new THREE.Vector3()

function anchorView(anchor) {
    // 三角の線を引く
    if (viewAnchorId.indexOf(anchor.identifier) == -1) {
        let applyOrientation = true
        let easing = 1

        anchorModel.fromArray(anchor.modelMatrix)
        anchorModel.decompose(tempAnchorPos, tempAnchorQuat, tempAnchorScale)

        let vert = anchor.vertices
        let material = new THREE.LineBasicMaterial({
            linewidth: 3,
            color: 0xcccc00
        })
        let geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]))
        geometry.vertices.push(new THREE.Vector3(vert[3], vert[4], vert[5]))
        geometry.vertices.push(new THREE.Vector3(vert[6], vert[7], vert[8]))
        geometry.vertices.push(new THREE.Vector3(vert[9], vert[10], vert[11]))
        geometry.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]))
        let obj = new THREE.Line(geometry, material)

        if (easing === 1) {
            obj.position.copy(tempAnchorPos)
            if (applyOrientation) {
                obj.quaternion.copy(tempAnchorQuat)
            }
        } else {
            obj.position.lerp(tempAnchorPos, easing)
            if (applyOrientation) {
                obj.quaternion.slerp(tempAnchorQuat, easing)
            }
        }

        scene.add(obj)
        viewAnchorId.push(anchor.identifier)
        // client.log({
        //     position: tempAnchorPos
        // })

    }
}

function guiView() {
    let item = {}
    let position = {
        x: 0,
        y: 0,
        z: 0
    }
    let folder = null
    let lastTime = 0
    let refreshTime = 10
    eventEmitter.on('animation', (operator, time) => {
        if (Date.now() - lastTime < refreshTime) {
            return
        }
        lastTime = Date.now()
        if (client.gui) {
            if (!folder) {
                folder = client.gui.addFolder('position')
                item.x = folder.add(position, 'x').step(0.001)
                item.y = folder.add(position, 'y').step(0.001)
                item.z = folder.add(position, 'z').step(0.001)
            }
            // client.log(position)
            position.x = vrFrameData.pose.position[0]
            position.y = vrFrameData.pose.position[1]
            position.z = vrFrameData.pose.position[2]
            item.x.updateDisplay()
            item.y.updateDisplay()
            item.z.updateDisplay()
        }
    })

}

function hitting() {
    // let c = vrDisplay.getPassThroughCamera()
    // client.log(c)
    // THREE.SceneUtils.traverseHierarchy( object, function ( object ) { object.visible = false; } );
    let geometry = new THREE.PlaneGeometry(0.02, 0.02) // width, height, widthSegments, heightSegments
    let material = new THREE.MeshBasicMaterial({
        color: 0x45ff45,
        side: THREE.DoubleSide
    })
    let plane = new THREE.Mesh(geometry, material)
    plane.position.set(0, 0, -0.5)
    plane.rotation.set(Math.PI / 2, 0, 0)
    plane.visible = true
    scene.add(plane)
    // atHit
    let pointMesh = []
    let pointMax = 300
    for (let i = 0; i < pointMax; i++) {
        pointMesh[i] = plane.clone()
        // pointMesh[i].scale.set(0.03, 0.03, 0.03)
        pointMesh[i].position.set(0, 0, -0.2)
        pointMesh[i].visible = false
        scene.add(pointMesh[i])
    }
    // 320: 524

    let range = 30
    let n = 0
    let lastTime = 50
    let refreshTime = 2500
    let times = 0
    let isHit = false
    eventEmitter.on('animation', (operator, time) => {
        if (Date.now() - lastTime < refreshTime) {
            return
        }
        times++
        if (times > 5) {
            return
        }
        lastTime = Date.now()

        // 非同期処理
        setTimeout(() => {
            n = 0
            for (let i = 0; i < pointMax; i++) {
                pointMesh[i].visible = false
            }
            // placeHit(0.5, 0.5)
            let height = window.innerHeight
            let width = window.innerWidth
            for (let y = range; y < window.innerHeight; y += range) {
                for (let x = range; x < window.innerWidth; x += range) {
                    let hitX = x / width
                    let hitY = y / height
                    setTimeout(() => {
                        if (n > pointMax) {
                            return
                        }
                        if (placeHit(hitX, hitY, n)) {
                            n++
                        }
                    }, 1)
                }
            }
        }, 1)

        // if (!isHit) {
        //     hit = placeHit(0.5, 0.5, 0)
        //     if (hit) {
        //         isHit = true
        //     }
        // }
        // let pos = toScreen(pointMesh[0].position)
        // client.log({
        //     a: pointMesh[0].position,
        //     b: pos
        // })
    })

    function toScreen(position) {
        let widthHalf = window.innerWidth / 2
        let heightHalf = window.innerWidth / 2

        let sPos = position.clone()
        sPos.project(camera)
        sPos.x = (sPos.x * widthHalf) + widthHalf
        sPos.y = -(sPos.y * heightHalf) + heightHalf
        sPos.z = 0
        return sPos
    }


    let model = new THREE.Matrix4()
    let tempPos = new THREE.Vector3()
    let tempQuat = new THREE.Quaternion()
    let tempScale = new THREE.Vector3()

    function placeObjectAtHit(object, hit) {
        let easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        let applyOrientation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        if (!hit || !hit.modelMatrix) {
            throw new Error('placeObjectAtHit requires a VRHit object');
        }

        model.fromArray(hit.modelMatrix);

        model.decompose(tempPos, tempQuat, tempScale)
        // client.log(tempPos)
        if (object) {

            if (easing === 1) {
                object.position.copy(tempPos);
                if (applyOrientation) {
                    object.quaternion.copy(tempQuat);
                }
            } else {
                object.position.lerp(tempPos, easing);
                if (applyOrientation) {
                    object.quaternion.slerp(tempQuat, easing);
                }
            }
            object.visible = true
            object.rotation.x += Math.PI / 2

        }
    }

    function placeHit(x, y, n = 0) {
        // client.log({
        //     x: x,
        //     y: y
        // })
        if (vrDisplay && vrDisplay.hitTest) {
            let hits = vrDisplay.hitTest(x, y)

            if (hits && hits.length) {
                // client.log(hits)
                let hit = hits[0]
                placeObjectAtHit(pointMesh[n], hit, true, 1)


                // THREE.ARUtils.placeObjectAtHit(pointMesh[n], // The object to place
                //     hit, // The VRHit object to move the cube to
                //     true, // Whether or not we also apply orientation
                //     1); // Easing value from 0 to 1; we want to move
                // the cube directly to the hit position
                return true
            }
        }
        return false
    }
}

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
    eventEmitter.on('animation', (operator, time) => {
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



    eventEmitter.on('animation', (operator, time) => {
        let pose = vrFrameData.pose
        let position = {
            x: pose.position[0] || 0,
            y: pose.position[1] || 0,
            z: pose.position[2] || 0
        }
        let orientation = pose.orientation
        client.send.position({
            id: client.data.user,
            position: position,
            orientation: orientation
        })
    })



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

}




/**
 * The render loop, called once per frame. Handles updating
 * our scene and rendering.
 */
let startTime = null
let frameStartTime = 0
let refreshTime = 15
let frameTime = {
    time: 0
}
let frameTimeFolder
let frameTimeGui
setTimeout(() => {
    frameTimeFolder = client.gui.addFolder('frameTime')
    frameTimeGui = frameTimeFolder.add(frameTime, 'time')
}, 3000)

function update(time) {

    if (!time) {
        if (!startTime) {
            startTime = Date.now()
        }
        time = Date.now() - startTime
    }
    // Kick off the requestAnimationFrame to call this function
    // on the next frame
    requestAnimationFrame(update)



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


    eventEmitter.emit('animation', time)
    frameStartTime = Date.now()

    stats.update()

    if (vrDisplay && vrDisplay['anchors_'] && vrDisplay['anchors_'].length >= 1) {
        vrDisplay['anchors_'].forEach((anchor) => {
            anchorView(anchor)
        })
    }
    renderer.render(scene, camera)

    frameTime.time = Date.now() - frameStartTime
    if (frameTimeFolder) {
        // client.log(frameTime.time)
        if (frameTimeGui) {
            frameTimeGui.updateDisplay()
            // frameTimeFolder.remove(frameTimeGui)
            // frameTimeGui = frameTimeFolder.add(frameTime, 'time')
        }
    }

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
function onClick(e) {
    let x = e.touches[0].pageX / window.innerWidth
    let y = e.touches[0].pageY / window.innerHeight
    sound.play('pizz_7')
    // Fetch the pose data from the current frame
    // let pose = vrFrameData.pose

    // Convert the pose orientation and position into
    // THREE.Quaternion and THREE.Vector3 respectively
    // let ori = new THREE.Quaternion(
    //     pose.orientation[0],
    //     pose.orientation[1],
    //     pose.orientation[2],
    //     pose.orientation[3]
    // )
    //
    // let pos = new THREE.Vector3(
    //     pose.position[0],
    //     pose.position[1],
    //     pose.position[2]
    // )
    if (vrDisplay && vrDisplay.hitTest) {
        let hits = vrDisplay.hitTest(x, y)

        if (hits && hits.length) {
            let hit = hits[0]
            let clone = triangle.clone()
            scene.add(clone)

            THREE.ARUtils.placeObjectAtHit(clone, // The object to place
                hit, // The VRHit object to move the cube to
                true, // Whether or not we also apply orientation
                1); // Easing value from 0 to 1; we want to move
            // the cube directly to the hit position
        }
    }

    // let dirMtx = new THREE.Matrix4()
    // dirMtx.makeRotationFromQuaternion(ori)
    //
    // let push = new THREE.Vector3(0, 0, -1.0)
    // push.transformDirection(dirMtx)
    // pos.addScaledVector(push, 0.125)
    //
    // // Clone our cube object and place it at the camera's
    // // current position
}
