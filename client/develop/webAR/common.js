/**
 * @overview ARとVRをレスポンシブ対応して共通に処理する
 * @module View/common
 */

let Job = require('./cron')

// BoxGeometry or BoxBufferGeometry
// BoxBufferGeometryの方がGPUにパラメータを渡すコストが減る
// その代わり，あとでGeometryを変更するのが大変
// なので静的なオブジェクトに有効（動かすならBufferじゃない）

// iPhone8 158.4 mm	78.1 mm	7.5 mm
let geometry = new THREE.BoxGeometry(0.0781, 0.1584, 0.0075)
let material = new THREE.MeshBasicMaterial({
    color: 0xdedee0
})
let deviceMesh = new THREE.Mesh(geometry, material)
let deviceMeshs = {}

/**
 * MeshObjectを返す scene.add()はここではしない MeshPositionのアップデートは行う
 * @param  {object} body positionData, callback{ MeshObject }
 */

exports.shareARPosition = (self) => {

    let client = self.client
    let scene = self.scene
    // let eventEmitter = self.eventEmitter

    client.receive.position((body) => {
        // remove my position data
        if (client.data.user == body.id) {
            return
        }

        // not in time
        if (body.time <= Date.now()) {
            setPosition(body, (mesh) => {
                scene.add(mesh)
            })
        }
        // after time
        else {
            let date = new Date(body.time)
            Job(date, () => {
                setPosition(body, (mesh) => {
                    scene.add(mesh)
                })
            })
        }
    })
}

function setPosition(body, callback) {
    let id = body.id
    if (!deviceMeshs[id]) {
        deviceMeshs[id] = deviceMesh.clone()
        callback(deviceMeshs[id])
    }
    if (body.position) {
        deviceMeshs[id].position.copy(body.position)
    }
    if (body.orientation) {
        let quaternion = new THREE.Quaternion(
            body.orientation[0],
            body.orientation[1],
            body.orientation[2],
            body.orientation[3]
        )
        deviceMeshs[id].quaternion.copy(quaternion)
    }
}


exports.frameTime = (callback) => {

    let lastFrameTime = null
    let frameTime = {
        time: 0,
    }
    let lastTime = 0
    let refreshTime = 1000
    let frame = () => {
        // frameTime
        let now = Date.now()
        if (lastFrameTime) {
            frameTime.time = Math.max(frameTime.time, now - lastFrameTime)
        }
        lastFrameTime = now

        // refresh
        if (now - lastTime < refreshTime) {
            return
        }
        callback(frameTime)
        lastTime = now
        frameTime.time = 0
    }
    return frame
}


exports.viewFrameTime = (self) => {

    let common = self.common
    let client = self.client
    let eventEmitter = self.eventEmitter

    let frameTimeGui
    let changeFrameTime = () => {
        if (!frameTimeGui && client.gui) {
            frameTimeGui = client.gui.addFolder('frameTime').add(frameTime, 'time')
        }
        if (frameTimeGui) {
            frameTimeGui.updateDisplay()
        }
    }

    let lastFrameTime = null
    let frameTime = {
        time: 0,
    }

    let lastTime = 0
    let refreshTime = 1000
    eventEmitter.on('animation', () => {
        // frameTime
        let now = Date.now()
        if (lastFrameTime) {
            frameTime.time = Math.max(frameTime.time, now - lastFrameTime)
        }
        lastFrameTime = now

        // refresh
        if (now - lastTime < refreshTime) {
            return
        }
        changeFrameTime()

        // init
        lastTime = now
        frameTime.time = 0
    })
}

exports.transGUI = (self, initPos = {}, callback = () => {}) => {

    let common = self.common
    let client = self.client
    let eventEmitter = self.eventEmitter

    let trans = {
        x: (initPos && initPos.x) || 0,
        y: (initPos && initPos.y) || 0,
        z: (initPos && initPos.z) || 0
    }
    let transFolder
    let transX
    let transY
    let transZ

    let set = () => {
        transFolder = client.gui.addFolder('trans')
        transX = transFolder.add(trans, 'x', -0.1, 0.1).step(0.001).onChange(call)
        transY = transFolder.add(trans, 'y', -0.1, 0.1).step(0.001).onChange(call)
        transZ = transFolder.add(trans, 'z', -0.1, 0.1).step(0.001).onChange(call)
    }

    let call = () => {
        callback(trans)
    }

    if (client.gui) {
        set()
    } else {
        setTimeout(() => {
            if (client.gui) {
                set()
            }
        }, 3000)
    }
    return trans
}
