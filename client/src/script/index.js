import PencilIcon from './icons/PencilIcon'
// import DeleteIcon from './icons/DeleteIcon'
import DrawBoard from './DrawBoard'
import User from './User'
import Alert from './Alert'
import '../styles/styles.css'
import Chat from './Chat'
// import {store$} from './Store'

// const canvas_2 = document.querySelector('.canvas_2')

// //icons
// // document.querySelector('.clear').innerHTML = DeleteIcon.getIcon()

// //events
// // document.querySelector('.range').addEventListener('input', event => drawBoard.setCursorWidth(event.target.value))
// // document.querySelector('.color').addEventListener('input', event => drawBoard.color = event.target.value)
document.querySelector('.clear').addEventListener('click', () => drawBoard.clearBoard())
document.querySelector('.takeSnapshot').addEventListener('click', () => drawBoard.stashCanvas())
document.querySelector('.restoreSnapshot').addEventListener('click', () => drawBoard.restoreCanvas())
document.querySelector('.download').addEventListener('click', () => drawBoard.saveImage())

let name = '', user, chat, message, drawBoard
//icons

let comigDataHandler = data => {
  drawBoard.draw(data.message.drawBuffer);
}
const canvas = document.querySelector('.canvas')
document.querySelector('.logo').innerHTML = PencilIcon.getIcon()
//Login form actions
document.querySelector('.input').addEventListener('input', e => name = e.target.value)
document.querySelector('.message-input').addEventListener('input', e => message = e.target.value)
document.querySelector('.welcome-form').addEventListener('submit', async e => {
    e.preventDefault()
    name = name.trim()
    if(name === '')
        new Alert('Empty name is not allowed', 'Error', 3000).showAlert()
    else {
      user = new User(name)
      const isAuth = await user.login()
      if(isAuth) {
        login()
        document.querySelector('.input').value = ''
        name = ''
        chat = new Chat(comigDataHandler)
        drawBoard = new DrawBoard(canvas, (buffer, options) => {
          chat.sendDrawBuffer(buffer, options)
        })
      } else {
        new Alert('Something wrong with server', 'error', 4000).showAlert()
      }
    }

})
document.querySelector('.logout').addEventListener('click', e => {
  e.preventDefault();
  user.logout()
  user = null
  logout()
})
document.querySelector('.chat-form').addEventListener('submit', e => {
    e.preventDefault()
    message = message.trim()
    if(message === '')
        new Alert('Empty message is not allowed', 'Error', 3000).showAlert()
    else {
      chat.sendMessage(message)
      document.querySelector('.message-input').value = ''
      message = ''
    }
})

const login = () => {
  document.querySelector('.welcome-container').setAttribute("style", "visibility: hidden;opacity: 0;")
  document.querySelector('.chat-container').setAttribute("style", "visibility: visible;opacity: 1;")
}

const logout = () => {
  document.querySelector('.chat-container').setAttribute("style", "visibility: hidden;opacity: 0;")
  document.querySelector('.welcome-container').setAttribute("style", "visibility: visible;opacity: 1;")
}

document.querySelector('.close-chat').addEventListener('click', () => {
  document.querySelector('.chat-wrapper').setAttribute("style", "transform: translateX(0)")
})

document.querySelector('.open-chat').addEventListener('click', () => {
  document.querySelector('.chat-wrapper').setAttribute("style", "transform: translateX(-500px)")
})
