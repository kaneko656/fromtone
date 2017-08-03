var rec = new webkitSpeechRecognition()
rec.continuous = true
rec.interimResults = false
rec.lang = 'ja-JP'

var userSaid = function(str, s) {
    return str.indexOf(s) > -1
}
rec.start()

setTimeout(() => {
    rec.stop()
}, 3000)

rec.onresult = function(e) {
    console.log(e)
    for (var i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
            var str = e.results[i][0].transcript;
            console.log('Recognised: ' + str);
            // if (userSaid(str, '赤')) {
            //     $('#box').css("background-color", "red");
            // } else if (userSaid(str, '青')) {
            //     $('#box').css("background-color", "blue");
            // } else if (userSaid(str, '黄色')) {
            //     $('#box').css("background-color", "yellow");
            // } else if (userSaid(str, '緑')) {
            //     $('#box').css("background-color", "green");
            // }

        }
    }
}
