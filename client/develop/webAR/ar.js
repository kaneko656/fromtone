const events = require('events')
let eventEmitter = new events.EventEmitter()

// AR/VR
let vrDisplay, vrFrameData, vrControls, arView

// Three.js
let canvas, camera, scene, renderer

// size
let width, height


// Geometry 廃止予定
let MeshProto = require('./proto-mesh.js')
let cube
let box, wire, triangle

let common = require('./common')


// view FPS  in update() write stats.update()
let Stats = require('./Stats.js')
let stats = new Stats()

// FromTone
let client, sound
const property = require('./../webSocket/property')


let calib = {
    position: null,
    orientation: null
}

/**
 * Use the `getARDisplay()` utility to leverage the WebVR API
 * to see if there are any AR-capable WebVR VRDisplays. Returns
 * a valid display if found. Otherwise, display the unsupported
 * browser message.
 */


exports.init = (_client, _sound, display) => {
    client = _client
    sound = _sound

    vrFrameData = new VRFrameData()
    vrDisplay = display
    var nativeLog = console.log.bind(console) //store native function
    console.log = function(...arg) { //override
        // nativeLog(arg[0])
        client.log(arg)
    }
    console.log('Device: ' + vrDisplay.displayName)


    // Turn on the debugging panel
    // let arDebug = new THREE.ARDebug(vrDisplay)
    // document.body.appendChild(arDebug.getElement())


    // step.1 renderer
    width = window.innerWidth
    height = window.innerHeight
    renderer = new THREE.WebGLRenderer({
        alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.autoClear = false

    // DOM
    canvas = renderer.domElement
    document.body.appendChild(canvas)
    width = canvas.width
    height = canvas.height

    // stat.js
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

    window.addEventListener('resize', onWindowResize, false)

    // calibration
    canvas.addEventListener('touchstart', (e) => {
        console.log('touch')
        // client.send.position({
        //     id: 'clone',
        //     position: {
        //         x: e.touches[0].pageX / window.innerWidth,
        //         y: e.touches[0].pageY / window.innerHeight,
        //         z: -1
        //     }
        // })
        // vrDisplay.resetPose()
        let pose = vrFrameData.pose
        console.log(pose)
        calib.position = {
            x: pose.position[0],
            y: pose.position[1],
            z: pose.position[2]
        }
        // calib.orientation = {
        //     a: pose.orientation[0],
        //     b: pose.orientation[1],
        //     c: pose.orientation[2],
        //     d: pose.orientation[3]
        // }
        console.log('calibration', calib)
    })


    console.log('shareARPosition')

    // send Position
    if (true) {
        let lastTime = 0
        let refreshTime = 10
        let positionBufferTime = 30
        eventEmitter.on('animation', () => {
            if (Date.now() - lastTime < refreshTime) {
                return
            }
            lastTime = Date.now()
            let pose = vrFrameData.pose
            let position = {
                x: pose.position[0] || 0,
                y: pose.position[1] || 0,
                z: pose.position[2] || 0
            }
            let orientation = pose.orientation

            // calibration
            if (calib.position) {
                position.x -= calib.position.x
                position.y -= calib.position.y
                position.z -= calib.position.z
            }

            // @TODO orientaion -> toration orientaionだと単純に差を取ってもだめ
            if (calib.orientation) {
                // orientation[0] -= calib.orientation.a
                // orientation[1] -= calib.orientation.b
                // orientation[2] -= calib.orientation.c
                // orientation[3] -= calib.orientation.d
            }

            client.send.position({
                id: client.data.user,
                time: Date.now() + positionBufferTime,
                position: position,
                orientation: orientation
            })
        })
    }

    // draw object in another device position
    client.receive.position((body) => {
        if (client.data.user == body.id) {
            return
        }
        common.shareARPosition(body, (mesh) => {
            scene.add(mesh)
        })
    })


    // setTimeout(() => {
    //     console.log('shareARPosition')
    //
    // }, 1000)

    // canvas.addEventListener('click', onClick, false)
    //
    // // Kick off the render loop!
    //
    // client.log(vrFrameData.pose)
    //
    guiView()
    //
    setTimeout(() => {
        // hitting()
    }, 500)

    // eventEmitter.on('animation', () => {
    // console.log('f')
    frameTime()





    // canvas.addEventListener('touchmove', (e) => {
    //     client.send.position({
    //         id: client.data.user,
    //         position: {
    //             x: e.touches[0].pageX / window.innerWidth,
    //             y: e.touches[0].pageY / window.innerHeight,
    //             z: 0
    //         }
    //     })
    // })
    update()

}

// same cord AR/VR
function frameTime() {
    let frameTimeGui
    let frame = common.frameTime((frameTime) => {
        if (!frameTimeGui && client.gui) {
            frameTimeGui = client.gui.addFolder('frameTime').add(frameTime, 'time')
        }
        if (frameTimeGui) {
            frameTimeGui.updateDisplay()
        }
    })
    eventEmitter.on('animation', () => {
        frame()
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
    let refreshTime = 1000
    eventEmitter.on('animation', (time) => {
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

    // for (let i = 0; i < pointMax; i++) {
    //     pointMesh[i] = plane.clone()
    //     // pointMesh[i].scale.set(0.03, 0.03, 0.03)
    //     pointMesh[i].position.set(0, 0, -0.2)
    //     pointMesh[i].visible = false
    //     scene.add(pointMesh[i])
    // }
    // 320: 524

    let lastTime = 50
    let refreshTime = 500

    let pointMax = 1000
    let n = 0
    let hitTimes = 10
    let nextObject = null
    // console.log('hitting')
    eventEmitter.on('animation', (time) => {
        if (Date.now() - lastTime < refreshTime) {
            return
        }
        lastTime = Date.now()
        if (n > pointMax) {
            return
        }

        // 非同期処理
        setTimeout(() => {
            for (let i = 0; i < hitTimes; i++) {
                let hitX = Math.random()
                let hitY = Math.random()
                if (n > pointMax) {
                    return
                }
                if (!nextObject) {
                    nextObject = plane.clone()
                    nextOjbect.scale.set(0.03, 0.03, 0.03)
                    object.visible = false
                }
                // console.log(hitX,hitY, typeof nextObject, n)
                if (placeHit(nextObject, hitX, hitY)) {
                    nextObject.visible = true
                    nextObject.rotation.x += Math.PI / 2
                    scene.add(Object.assign(nextObject, {}))
                    nextObject = null
                    n++
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
        }
    }

    function placeHit(object, x, y) {
        // client.log({
        //     x: x,
        //     y: y
        // })
        if (vrDisplay && vrDisplay.hitTest) {
            let hits = vrDisplay.hitTest(x, y)

            if (hits && hits.length) {
                // client.log(hits)
                let hit = hits[0]
                placeObjectAtHit(object, hit, true, 1)


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

function frameTime() {
    let frameTimeFolder
    let frameTimeGui
    setTimeout(() => {
        if (client.gui) {
            frameTimeFolder = client.gui.addFolder('frameTime')
            frameTimeGui = frameTimeFolder.add(frameTime, 'time')
        }
    }, 8000)

    eventEmitter.on('animation', () => {
        frameTime.time = Date.now() - frameStartTime
        if (frameTimeFolder) {
            // client.log(frameTime.time)
            if (frameTimeGui) {
                frameTimeGui.updateDisplay()
                // frameTimeFolder.remove(frameTimeGui)
                // frameTimeGui = frameTimeFolder.add(frameTime, 'time')
            }
        }
    })
}
/**
 * The render loop, called once per frame. Handles updating
 * our scene and rendering.
 */



function update(time) {


    // Kick off the requestAnimationFrame to call this function
    // on the next frame
    vrDisplay.requestAnimationFrame(update)

    // From the WebVR API, populate `vrFrameData` with
    // updated information for the frame
    vrDisplay.getFrameData(vrFrameData)

    eventEmitter.emit('animation', time)
    frameStartTime = Date.now()

    // Update our perspective camera's positioning
    vrControls.update()

    // Render the device's camera stream on screen first of all.
    // It allows to get the right pose synchronized with the right frame.
    arView.render()

    // Update our camera projection matrix in the event that
    // the near or far planes have updated
    camera.updateProjectionMatrix()


    // Render our three.js virtual scene
    renderer.clearDepth()

    renderer.render(scene, camera)


    stats.update()


    // if (vrDisplay && vrDisplay['anchors_'] && vrDisplay['anchors_'].length >= 1) {
    //     setTimeout(() => {
    //         vrDisplay['anchors_'].forEach((anchor) => {
    //             anchorView(anchor)
    //         })
    //     }, 1)
    // }


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
    console.log('click')
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

    client.send.position({
        id: client.data.user,
        position: {
            x: x,
            y: y,
            z: -1
        }
    })

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
