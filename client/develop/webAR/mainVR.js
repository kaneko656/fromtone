const events = require('events')
const Stats = require('./Stats.js')

let MeshProto = require('./proto-mesh.js')


class VR {

    constructor(client, sound) {
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
        this.calibration = {
            position: null,
            orientation: null,
            rotation: null
        }

        // param
        this.client = client
        this.sound = sound

        // inner modules
        this.common = require('./common')
        this.property = require('./../webSocket/property')
        this.init()
    }

    init() {

        // step.1 renderer
        this.width = window.innerWidth
        this.height = window.innerHeight
        console.log('s1')
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)
        console.log('s1')

        // DOM
        this.canvas = this.renderer.domElement
        document.body.appendChild(this.canvas)

        // step.2 scene
        this.scene = new THREE.Scene()

        // step.3 camera
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.01, 10000)
        this.camera.position.set(0, 0, 0.5)


        this.controls = new THREE.OrbitControls(this.camera, this.canvas)


        // step.5 light
        let directionalLight = new THREE.DirectionalLight(0xFFFFFF)
        directionalLight.position.set(0, 0, 0.5)
        this.scene.add(directionalLight)

        console.log('update')
        this.update()
        this.common.viewFrameTime(this)
        this.common.shareARPosition(this)
        this.canvas.addEventListener('click', () => {
            this.onClick()
        })

        let t = this.common.transGUI(this, null, (trans) => {
            // console.log(trans)
            // console.log(t)
        })

        // return
    }

    update() {
        // console.log(this.eventEmitter)
        this.controls.update()
        this.stats.update()
        this.eventEmitter.emit('animation', {})


        this.renderer.render(this.scene, this.camera)

        requestAnimationFrame(() => {
            this.update()
        })
    }

    sendPosition() {

        let client = this.client
        let calib = this.calibration
        let vrFrameData = this.vrFrameData

        // send Position
        let lastTime = 0
        let refreshTime = 10
        let positionBufferTime = 30
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

    onClick() {
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
        this.scene.add(mesh)

        let x = Math.random() / 10 - 0.05
        let y = Math.random() / 10 - 0.05

        // mesh.rotation.x += 0.01 + x
        // mesh.rotation.y += 0.01 + y

        // renderer.render(scene, camera)

    }
}

exports.start = (client, sound) => {
    let ar = new VR(client, sound)
}
