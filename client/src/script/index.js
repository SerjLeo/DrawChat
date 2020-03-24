import {Subject} from 'rxjs'
import {scan, startWith, shareReplay} from 'rxjs/operators'
import Pencil from './icons/Pencil'
import DeleteIcon from './icons/DeleteIcon'
import DrawBoard from './DrawBoard'
import Chat from './Chat'
import '../styles/styles.css'

const canvas = document.querySelector('.canvas')
const canvas_2 = document.querySelector('.canvas_2')

//icons
// document.querySelector('.clear').innerHTML = DeleteIcon.getIcon()
// document.querySelector('.logo').innerHTML = Pencil.getIcon()

function bufferHandler(buff, opt) {
    opt.strokeStyle = '#fff';
    opt.lineWidth = 1;
    drawBoard_2.draw(buff)
}

const drawBoard = new DrawBoard(canvas, bufferHandler)
const drawBoard_2 = new DrawBoard(canvas_2)

//events
// document.querySelector('.range').addEventListener('input', event => drawBoard.setCursorWidth(event.target.value))
// document.querySelector('.color').addEventListener('input', event => drawBoard.color = event.target.value)
document.querySelector('.clear').addEventListener('click', () => drawBoard.clearBoard())
document.querySelector('.takeSnapshot').addEventListener('click', () => drawBoard.stashCanvas())
document.querySelector('.restoreSnapshot').addEventListener('click', () => drawBoard.restoreCanvas())
document.querySelector('.download').addEventListener('click', () => drawBoard.saveImage())

const initialState = []

const handlers = {
  INCREMENT: (state, action) => ([...state, action.payload]),
  DECREMENT: state => {
    state.shift()
    return [...state]
  },
  DEFAULT: state => state
}

function reducer(state = initialState, action) {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}

function createStore(rootReducer) {
  const subj$ = new Subject()

  const store$ = subj$.pipe(
    startWith({type: '__INIT__'}),
    scan(rootReducer, undefined),
    shareReplay(1)
  )

  store$.dispatch = action => subj$.next(action)

  return store$
}

const store$ = createStore(reducer)

store$.subscribe(state => {
  console.log(state)
  if(state.length > 0) {
      canvas.draw(state[0])
    // setTimeout(() => store$.dispatch({type: 'DECREMENT'}), 1000)
  }
})