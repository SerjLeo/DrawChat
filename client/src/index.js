import Pencil from './Pencil'
import DrawBoard from './DrawBoard'
import './styles/styles.css'

const logo = document.querySelector('.logo')
const canvas = document.querySelector('.canvas')

const pencil = new Pencil()
logo.innerHTML = pencil.getIcon()

const drawBoard = new DrawBoard(canvas)
//events
document.querySelector('.clear').addEventListener('click', () => drawBoard.clearBoard())
// document.querySelector('.color').addEventListener('click', event => drawBoard.color = event.target.value)
document.querySelector('.color').addEventListener('click', () => drawBoard.cursorWidth = 20)

drawBoard.color = 'red'
drawBoard.drawOnClick()
