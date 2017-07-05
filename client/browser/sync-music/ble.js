console.log(window.navigator)

// importModules([
//     // 'content/public/renderer/frame_interfaces',
//     // 'device/bluetooth/public/interfaces/adapter.mojom',
//     'device/bluetooth/public/interfaces/device.mojom',
//     // 'mojo/public/js/bindings',
// ]).then(function([bluetoothDevice]) {
//     console.log(bluetoothDevice)
// });
//
//
// /**
//  * Helper to convert callback-based define() API to a promise-based API.
//  * @suppress {undefinedVars}
//  * @param {!Array<string>} moduleNames
//  * @return {!Promise}
//  */
// function importModules(moduleNames) {
//     return new Promise(function(resolve) {
//         console.log(moduleNames)
//         define(moduleNames, function() {
//             console.log(moduleNames)
//             resolve(Array.from(arguments));
//         });
//     });
// }
//
// function define(tagNameOrFunction) {
//     var createFunction, tagName;
//     if (typeof tagNameOrFunction == 'function') {
//         createFunction = tagNameOrFunction;
//         tagName = '';
//     } else {
//         createFunction = createElementHelper;
//         tagName = tagNameOrFunction;
//     }
//
//     /**
//      * Creates a new UI element constructor.
//      * @param {Object=} opt_propertyBag Optional bag of properties to set on the
//      *     object after created. The property {@code ownerDocument} is special
//      *     cased and it allows you to create the element in a different
//      *     document than the default.
//      * @constructor
//      */
//     function f(opt_propertyBag) {
//         var el = createFunction(tagName, opt_propertyBag);
//         f.decorate(el);
//         for (var propertyName in opt_propertyBag) {
//             el[propertyName] = opt_propertyBag[propertyName];
//         }
//         return el;
//     }
//
//     /**
//      * Decorates an element as a UI element class.
//      * @param {!Element} el The element to decorate.
//      */
//     f.decorate = function(el) {
//         el.__proto__ = f.prototype;
//         el.decorate();
//     };
//
//     return f;
// }
//
// function decorate(source, constr) {
//     var elements;
//     if (typeof source == 'string')
//         elements = cr.doc.querySelectorAll(source);
//     else
//         elements = [source];
//
//     for (var i = 0, el; el = elements[i]; i++) {
//         if (!(el instanceof constr))
//             constr.decorate(el);
//     }
// }
//
// /**
//  * Helper function for creating new element for define.
//  */
// function createElementHelper(tagName, opt_bag) {
//     // Allow passing in ownerDocument to create in a different document.
//     var doc;
//     if (opt_bag && opt_bag.ownerDocument)
//         doc = opt_bag.ownerDocument;
//     else
//         doc = cr.doc;
//     return doc.createElement(tagName);
// }
//
//
// // var known_service = "A service in the iBeacon’s GATT server";
// // navigator.bluetooth.requestDevice({}).then(device => {
// //     console.log(device)
// //     // device.watchAdvertisements();
// //     // device.addEventListener('advertisementreceived', interpretIBeacon);
// // })
// //
// // function interpretIBeacon(event) {
// //     var rssi = event.rssi;
// //     var appleData = event.manufacturerData.get(0x004C);
// //     if (appleData.byteLength != 23 ||
// //         appleData.getUint16(0, false) !== 0x0215) {
// //         console.log({
// //             isBeacon: false
// //         });
// //     }
// //     var uuidArray = new Uint8Array(appleData.buffer, 2, 16);
// //     var major = appleData.getUint16(18, false);
// //     var minor = appleData.getUint16(20, false);
// //     var txPowerAt1m = -appleData.getInt8(22);
// //     console.log({
// //         isBeacon: true,
// //         uuidArray,
// //         major,
// //         minor,
// //         pathLossVs1m: txPowerAt1m - rssi
// //     })
// // }
// //
// // // ① デバイスのスキャン
// //
// // console.log(navigator.bluetooth)
navigator.bluetooth.requestDevice({
  acceptAllDevices: true
  // optionalServices: ['battery_service']
})
.then(device => {
  console.log(device)
  console.log(device.adData)
  return device.connectGATT();
 })
 .then(server =>{
    console.log(server)
 })
 // return Promise.all([
 //     server.getPrimaryService('link_loss'),
 //     server.getPrimaryService('immediate_alert'),
 //     server.getPrimaryService('tx_power')
 //   ]);
 // })
 // .then(services =>{
 //   console.log(services)
 // ④ Serviceを全部調べたので、次はサービスに紐づくCharacteristicsを調べる
  //  return Promise.all([
  //    services[0].getCharacteristic('alert_level'),
  //    services[1].getCharacteristic('alert_level'),
  //    services[2].getCharacteristic('tx_power_level')
  //  ]);
.catch(error => { console.log(error); });
// navigator.bluetooth.requestDevice({
//   filters: [{
//     services: [
//       'link_loss',
//       'immediate_alert',
//       'tx_power'
//     ]
//   }]
// })
// //   .then(device =>{
// //     // ② デバイス見つかったので、接続する
// //     console.log(device)
// //     // return device.connectGATT();
// //   })
// // .then(server =>{
// //   console.log(server)
// //   // ③ デバイスに接続できたので、そのデバイスのServiceを調べる
// //   return Promise.all([
// //     server.getPrimaryService('link_loss'),
// //     server.getPrimaryService('immediate_alert'),
// //     server.getPrimaryService('tx_power')
// //   ]);
// // })
// // .then(services =>{
// //   console.log(services)
// // // ④ Serviceを全部調べたので、次はサービスに紐づくCharacteristicsを調べる
// //   return Promise.all([
// //     services[0].getCharacteristic('alert_level'),
// //     services[1].getCharacteristic('alert_level'),
// //     services[2].getCharacteristic('tx_power_level')
// //   ]);
// // })
// // // Discovered characteristics
// // .then(characteristics =>{
// //     console.log(characteristics)
// //     // ⑤ 全部の Chracteristics をゲット
// //     // あとはその Characteristics を Read/Writeしていく
// // })
// // .catch(error =>{
// //   // エラー時はここにくる
// //   console.log(error);
// // });
