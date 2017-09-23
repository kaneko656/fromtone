let video = document.createElement('video')
video.id = 'video'
video.autoplay = ''
video.playsinline = ''
document.body.appendChild(video)
// video.width = 320;
// video.height = 240;

// ios11 safari
// const medias = {
//     audio: false,
//     video: true
// }
// let video = document.getElementById("video")

// navigator.getUserMedia(medias, successCallback, errorCallback);
//
// function successCallback(stream) {
//     video.srcObject = stream;
// }
//
// function errorCallback(err) {
//     alert(err)
// }


var getUserMedia = function(t, onsuccess, onerror) {
    if (navigator.getUserMedia) {
        return navigator.getUserMedia(t, onsuccess, onerror);
    } else if (navigator.webkitGetUserMedia) {
        return navigator.webkitGetUserMedia(t, onsuccess, onerror);
    } else if (navigator.mozGetUserMedia) {
        return navigator.mozGetUserMedia(t, onsuccess, onerror);
    } else if (navigator.msGetUserMedia) {
        return navigator.msGetUserMedia(t, onsuccess, onerror);
    } else {
        onerror(new Error("No getUserMedia implementation found."));
    }
}

var URL = window.URL || window.webkitURL;
var createObjectURL = URL.createObjectURL || webkitURL.createObjectURL;
if (!createObjectURL) {
    throw new Error("URL.createObjectURL not found.");
}


// httpsに対応している必要
getUserMedia({
        'video': true
    },
    function(stream) {
        var url = createObjectURL(stream);
        video.src = url
    },
    function(error) {
        console.log(error)
        alert("Couldn't access webcam." + error);
    }
)

exports.process = (canvas, data) => {
    // let video = createElement('video')
    // video.width = '360px'
    // video.height = '270px'
    // video.autoplay = ''
    // video
    require('./../webSocket/socketClient.js').log('start')
    // var imageData = {}
    // imageData.data = data
    // imageData.width = canvas.width
    // imageData.height = canvas.height
    //
    // var reader = new com.google.zxing.qrcode.QRCodeReader();
    // var source = new RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
    // console.log(source)
    // var bitmap = new com.google.zxing.BinaryBitmap(new com.google.zxing.common.HybridBinarizer(source));
    // console.log(bitmap)
    // var result = reader.decode1(bitmap);
    // console.log(result)
    // var message = result.get_text()
    // console.log(message)
    // require('./../webSocket/socketClient.js').log(message)
}
