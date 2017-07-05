//Canvasの設定

// var io = new RocketIO().connect("http://linda.masuilab.org");
// var linda = new Linda(io);
// var ts = new linda.TupleSpace("delta");
//
// io.on("connect", function(){
//   alert(io.type+" connect");
// });
var context;
window.addEventListener('load', init, false);

function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        let context = new AudioContext();
        console.log(context)
        load(context)
    } catch (e) {
        alert('Web Audio API is not supported in this browser');
    }
}

let ctx = null
let w, h
let filter, analyser, audioContext


let load = (_audioContext) => {
    audioContext = _audioContext

    var canvas = document.getElementById("world");
    console.log(canvas)
    ctx = canvas.getContext("2d");
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // var audioContext = new AudioContext();

    //フィルター
    filter = audioContext.createBiquadFilter();
    // filter.type = 0;
    // filter.frequency.value = 440;
    //analyserオブジェクトの生成
    analyser = audioContext.createAnalyser();

    console.log(audioContext)
    console.log(filter)
    console.log(analyser)
    main(audioContext, filter, analyser);
}


/*-----------------------------------
    メイン関数
-----------------------------------*/
function main(audioContext, filter, analyser) {
    var audioObj = {
        "audio": true
    };

    //エラー処理
    var errBack = function(e) {
        console.log("Web Audio error:", e.code);
    };

    //WebAudioリクエスト成功時に呼び出されるコールバック関数
    function gotStream(stream) {
        //streamからAudioNodeを作成
        var mediaStreamSource = audioContext.createMediaStreamSource(stream);

        mediaStreamSource.connect(filter);

        filter.connect(analyser);
        //出力Nodeのdestinationに接続
        analyser.connect(audioContext.destination);
        //mediaStreamSource.connect(audioContext.destination);

        //ループ
        setInterval(Loop, 1);
        Loop(ctx);
    }
    //マイクの有無を調べる
    if (navigator.webkitGetUserMedia) {
        //マイク使って良いか聞いてくる
        navigator.webkitGetUserMedia(audioObj, gotStream, errBack);
    } else {
        console.log("マイクデバイスがありません");
    }
}


function Loop() {
    //Canvasをクリア
    ctx.clearRect(0, 0, w, h);
    //背景色
    ctx.fillStyle = "#efefef";
    //背景描画
    ctx.fillRect(0, 0, w, h);

    //符号なし8bitArrayを生成
    var data = new Uint8Array(analyser.frequencyBinCount);
    //周波数データ
    analyser.getByteFrequencyData(data);
    //周波数の色
    ctx.fillStyle = "#ccc";

  ////ここから判定＊＊＊＊

    let peek = 0
    let peekValue = 0
    // console.log(data)
    data.forEach((v, i) => {
        if(peekValue < v){
            peekValue = v
            peek = i
        }
    })

    let rate = 21.533

    for(let i=1; i<=22; i++){
      let n = Math.round(1000*i/rate)
      if(data[n] > 0){
          // console.log((1000*i) + 'Hz')
      }
      if(i==1 && data[n]>10){
          let catchTime = performance.now()
          //　console.log(catchTime)
          console.log(String(new Date().getTime()).slice(-5))
      }
    }
    // console.log(data.length)

    //  46 == 1000   93 == 2000
    //  1000/46  =21.73
    // 44100 サンプル
    // 44100/2/1028 = 21.533
    // 16000/1024

    // if (data[1000] > 100) {
    //     ts.write(["hue", "0", "hsb", "1", "200", "200"]);
    // } else if (data[800] > 100) {
    //     ts.write(["hue", "0", "hsb", "10000", "200", "200"]);
    // } else if (data[600] > 100) {
    //     ts.write(["hue", "0", "hsb", "18000", "200", "200"]);
    // } else if (data[400] > 100) {
    //     ts.write(["hue", "0", "hsb", "5000", "200", "200"]);
    // } else if (data[200] > 100) {
    //     ts.write(["hue", "0", "hsb", "20000", "200", "200"]);
    // } else {
    //     ts.write(["hue", "0", "hsb", "40000", "200", "100"]);
    // }
    //////ここまで＊＊＊＊


    //グラフ描画
    for (var i = 0; i < data.length; ++i) {
        //上部の描画
        ctx.fillRect(i * 5, 0, 5, data[i]);
        //下部の描画
        ctx.fillRect(i * 5, h, 5, -data[i]);
    }
}
