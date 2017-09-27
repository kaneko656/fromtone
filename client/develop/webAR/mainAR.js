const events = require('events')
const Stats = require('./Stats.js')




class AR {

    constructor(client, sound, vrDisplay) {
        // modules
        this.stats = new Stats()
        this.eventEmitter = new events.EventEmitter()

        // AR/VR
        this.vrDisplay
        this.vrFrameData
        this.vrControls
        this.arView

        // Three.js
        this.canvas
        this.camera
        this.scene
        this.renderer

        // size
        this.width
        this.height

        // calibration
        this.calibrationData = {
            position: null,
            orientation: null,
            rotation: null
        }
        this.trans

        // param
        this.client = client
        this.sound = sound

        // inner modules
        this.common = require('./common')
        this.property = require('./../webSocket/property')

        // method
        this.init(vrDisplay)
        this.common.viewFrameTime(this)
        this.common.shareARPosition(this)
    }

    init(vrDisplay) {
        this.vrFrameData = new VRFrameData()
        this.vrDisplay = vrDisplay

        // step.1 renderer
        this.width = window.innerWidth
        this.height = window.innerHeight
        console.log('s1')
        this.renderer = new THREE.WebGLRenderer({
            alpha: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)
        this.renderer.autoClear = false

        // DOM
        this.canvas = this.renderer.domElement
        document.body.appendChild(this.canvas)

        // stat.js
        document.body.appendChild(this.stats.domElement)

        // step.2 scene
        this.scene = new THREE.Scene()

        console.log('f')

        this.arView = new THREE.ARView(this.vrDisplay, this.renderer)

        // step.3 camera
        this.camera = new THREE.ARPerspectiveCamera(
            this.vrDisplay,
            60,
            this.width / this.height,
            this.vrDisplay.depthNear,
            this.vrDisplay.depthFar
        )

        this.vrControls = new THREE.VRControls(this.camera)

        // step.4 mesh
        // initTriangle()

        // window.addEventListener('resize', onWindowResize, false)

        this.update()
        this.trans = this.common.transGUI(this, {
          x: -0.0,
          y: -0.0,
          z: 0.0
        }, (trans) => {})
        this.sendPosition()
        this.canvas.addEventListener('touchstart', (e) => {
            console.log('start')
            this.calibration()
        })
    }

    update() {
        // Kick off the requestAnimationFrame to call this function
        // on the next frame
        this.vrDisplay.requestAnimationFrame(() => {
            this.update()
        })

        // From the WebVR API, populate `vrFrameData` with
        // updated information for the frame
        this.vrDisplay.getFrameData(this.vrFrameData)

        // Update our perspective camera's positioning
        this.vrControls.update()

        // Render the device's camera stream on screen first of all.
        // It allows to get the right pose synchronized with the right frame.
        this.arView.render()

        // Update our camera projection matrix in the event that
        // the near or far planes have updated
        this.camera.updateProjectionMatrix()

        // Render our three.js virtual scene
        this.renderer.clearDepth()

        this.eventEmitter.emit('animation')

        this.renderer.render(this.scene, this.camera)

        this.stats.update()
    }

    sendPosition() {

        let client = this.client
        let calib = this.calibrationData
        let vrFrameData = this.vrFrameData
        let trans = this.trans

        // send Position
        let lastTime = 0
        let refreshTime = 10
        let positionBufferTime = 10
        this.eventEmitter.on('animation', () => {
            if (Date.now() - lastTime < refreshTime) {
                return
            }
            lastTime = Date.now()
            let pose = this.vrFrameData.pose
            let position = {
                x: pose.position[0] || 0,
                y: pose.position[1] || 0,
                z: pose.position[2] || 0
            }
            let orientation = pose.orientation

            if (calib.position) {
                position.x -= calib.position.x
                position.y -= calib.position.y
                position.z -= calib.position.z
            }
            if(trans){
              position.x += trans.x
              position.y += trans.y
              position.z += trans.z
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

    calibration() {
        console.log('s')
        let pose = this.vrFrameData.pose
        let calib = this.calibrationData

        calib.position = {
            x: pose.position[0],
            y: pose.position[1],
            z: pose.position[2] + 0.05
        }
        console.log('calibration')
    }

}

exports.start = (client, sound, vrDisplay) => {
    let nativeLog = console.log.bind(console) //store native function
    console.log = function(...arg) { //override
        // nativeLog(arg[0])
        client.log(arg)
    }
    console.log('Device: ' + vrDisplay.displayName)
    let ar = new AR(client, sound, vrDisplay)
}
