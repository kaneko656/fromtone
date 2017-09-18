let geometry = new THREE.Geometry()
geometry.vertices.push(new THREE.Vector3(0, 0, 1))
geometry.vertices.push(new THREE.Vector3(1, 0, 0))
geometry.vertices.push(new THREE.Vector3(0, -1, 0))
geometry.vertices.push(new THREE.Vector3(-1, 0, 0))
geometry.vertices.push(new THREE.Vector3(0, 1, 0))
geometry.vertices.push(new THREE.Vector3(0, 0, -1))

// Face3(a, b, c, normal, color, materialIndex)
geometry.faces.push(new THREE.Face3(0, 2, 1))
geometry.faces.push(new THREE.Face3(0, 3, 2))
geometry.faces.push(new THREE.Face3(0, 4, 3))
geometry.faces.push(new THREE.Face3(0, 1, 4))
geometry.faces.push(new THREE.Face3(5, 1, 2))
geometry.faces.push(new THREE.Face3(5, 2, 3))
geometry.faces.push(new THREE.Face3(5, 3, 4))
geometry.faces.push(new THREE.Face3(5, 4, 1))

// 法線ベクトル　自動計算＆セット
geometry.computeFaceNormals()
// 滑らかなシェーディング
geometry.computeVertexNormals()


exports.mesh = () => {
    //八面体のメッシュ作成
    var material = new THREE.MeshNormalMaterial()
    //var material = new THREE.MeshPhongMaterial({color: 0x88FFFF})
    var mesh = new THREE.Mesh(geometry, material)
    return mesh
}

exports.meshWire = () => {
    // //ワイヤーフレームのメッシュ作成
    var wire = new THREE.MeshBasicMaterial({
        color: 0x8888cc,
        wireframe: true
    })
    var wireMesh = new THREE.Mesh(geometry, wire)
    return wireMesh
}

exports.group = () => {
    let group = new THREE.Group()
    group.add(module.exports.mesh())
    group.add(module.exports.meshWire())
    return group
}
