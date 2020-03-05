/* eslint-env jquery*/

let name = 'anonymous'
let oldName

$(function () {
  const socket = io('http://172.16.9.18:3000')

  $('#input').submit(function (e) {
    e.preventDefault()
    let message
    const dateTime = new Date()
    if ($('#message').val().substr(0, 6) === '/name ') {
      oldName = name
      name = $('#message').val().slice(6)
      message = `(${dateTime.toLocaleTimeString()}) User <${oldName}> changed to <${name}>`
    } else {
      message = `(${dateTime.toLocaleTimeString()}) <${name}> ${$('#message').val()}`
    }

    socket.emit('chat-message', message)
    $('#message').val('')
    return
  })

  $('input').keypress(isTyping)

  function isTyping () {
    socket.emit('isTyping')
  }

  socket.on('chat-message', function (data) {
    console.log('received chat message:', data)
    $('#messages').append($('<li>').text(data))
  })
  socket.on('isTyping', function () {
    $('#isTyping').show()
    $('#isTyping').text(`${name} is typing...`)
    setTimeout(function () {
      $('#isTyping').hide()
    }, 2000)
  })
})
