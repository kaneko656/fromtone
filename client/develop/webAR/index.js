const ar = require('./ar.js')

/**
 * Use the `getARDisplay()` utility to leverage the WebVR API
 * to see if there are any AR-capable WebVR VRDisplays. Returns
 * a valid display if found. Otherwise, display the unsupported
 * browser message.
 */

/**
 * AR/VR Responsive
 * @param  {object} client socketClient
 * @param  {object} sound  soundManager
 */
exports.start = (client, sound) => {
    THREE.ARUtils.getARDisplay().then(function(display) {
        if (display) {
            // ar.init(client, sound, display)
            require('./mainAR.js').start(client, sound, display)
        } else {
            // THREE.ARUtils.displayUnsupportedMessage()
            console.log('This device can not use webAR')
            // require('./protoVR.js').initVR(client, sound)
            require('./mainVR.js').start(client, sound)
        }
    })
}
