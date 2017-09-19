
// if (!navigator.webkitGetUserMedia)
// {
//  window.alert("ごめんなさい。Chrome専用なんです。");
//    return
// }
//
// navigator.webkitGetUserMedia({ audio:false, video:true }, function(stream){
//  var video = document.getElementById("v");
//    video.src = webkitURL.createObjectURL(stream);
// },function(error){
//     window.alert("エラーが出て、Webカメラが使えないみたいです。。。。\n\n" + error.toString());
// })
// <video id="v" autoplay="" style="width: 360px; width: 270px;"></video>

var video = document.createElement('video');
video.width = 320;
video.height = 240;

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
};

var URL = window.URL || window.webkitURL;
var createObjectURL = URL.createObjectURL || webkitURL.createObjectURL;
if (!createObjectURL) {
  throw new Error("URL.createObjectURL not found.");
}


// httpsに対応している必要
getUserMedia({'video': true},
  function(stream) {
    var url = createObjectURL(stream);
    video.src = url;
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
