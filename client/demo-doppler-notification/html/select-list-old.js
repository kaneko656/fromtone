let div = null

exports.init = (element) => {
    div = document.createElement('div')
    // div.setAttribute('class', 'demo-content')
    // // div.setAttribute('class', 'col-xs-3')
    //
    let h = document.createElement('h5')
    h.innerHTML = 'To'
    div.appendChild(h)

    element.appendChild(div)
}

exports.setList = (nameList) => {

    // let nameList = []
    // list.forEach((obj) => {
    //     nameList.push(obj.name)
    // })
    console.log(nameList)

    //   <div class="input-group">
    // <span class="input-group-addon">@</span>
    // <input type="text" class="form-control" placeholder="Prepend" />
    // </div>
    //  <select class="form-control select select-primary" data-toggle="select">
    //   <option value="0">Choose hero</option>
    //   <option value="1">Spider Man</option>
    //   <option value="2">Wolverine</option>
    //   <option value="3">Captain America</option>
    //   <option value="4" selected>X-Men</option>
    //   <option value="5">Crocodile</option>
    // </select>
    // let div = document.createElement('div')
    // div.setAttribute('class', 'demo-content')
    // // div.setAttribute('class', 'col-xs-3')
    //
    // let h = document.createElement('h5')
    // h.innerHTML = 'To'
    //
    // let list = document.createElement('select')
    // list.setAttribute('class', 'form-control select select-primary')
    // list.setAttribute('data-toggle', 'select')
    // list.setAttribute('name', 'selectlist')
    // // list.setAttribute('style', 'background-color: #F0F0F0')
    // list.setAttribute('size', '5')
    // list.setAttribute('multiple', '')
    // let textList = ['サンプル1', 'サンプル2', 'サンプル3']
    // textList.forEach((text, i) => {
    //     let option = document.createElement('option')
    //     option.innerHTML = text
    //     option.setAttribute('value', i)
    //     list.appendChild(option)
    // })
    // list.onchange = (e) => {
    //     console.log(e.target.value)
    // }


    let textList2 = ['サンプル1', 'サンプル2', 'サンプル3']
    nameList.forEach((name, i) => {
        console.log(name)
        let label = document.createElement('label')
        label.setAttribute('class', 'checkbox')
        label.setAttribute('for', 'checkbox' + i)

        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('value', name)
        input.setAttribute('class', 'checkbox')
        input.setAttribute('id', 'checkbox' + i)
        input.setAttribute('data-toggle', 'checkbox')
        label.innerHTML = name
        label.appendChild(input)
        div.appendChild(label)
    })


    // div.appendChild(label)

    // element.appendChild(div)

    $(':checkbox').radiocheck()

    $(':checkbox').on('change.radiocheck', function(e) {
        console.log('radiocheck')
        console.log(e.target.value)
        console.log(e.target.checked)
        // console.log(e)
    })


}
