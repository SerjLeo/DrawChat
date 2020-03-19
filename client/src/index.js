import Pencil from './Pencil'
import DeleteIcon from './DeleteIcon'
import DrawBoard from './DrawBoard'
import Chat from './Chat'
import './styles/styles.css'

const canvas = document.querySelector('.canvas')

//icons
document.querySelector('.clear').innerHTML = DeleteIcon.getIcon()
document.querySelector('.logo').innerHTML = Pencil.getIcon()

const drawBoard = new DrawBoard(canvas)

//events
document.querySelector('.clear').addEventListener('click', () => drawBoard.clearBoard())
document.querySelector('.range').addEventListener('input', event => drawBoard.setCursorWidth(event.target.value))
document.querySelector('.color').addEventListener('input', event => drawBoard.color = event.target.value)

drawBoard.drawOnClick()

const user = new Chat('Sergey')
user.openConnection()