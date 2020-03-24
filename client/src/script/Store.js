import {Subject} from 'rxjs'
import {scan, tap, startWith, shareReplay, filter} from 'rxjs/operators'

let initialState = {
    drawBuffer: [],
    isDrawing: false
}

const handlers = {
  INCREMENT: (state, action) => ({...state, drawBuffer: [...state.drawBuffer, action.payload]}),
  INITIATE: state => ({...state, isDrawing: true}),
  DECREMENT: state => {
    state.drawBuffer.shift()
    return {...state, isDrawing:false}
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
    filter(value => !value.isDrawing),
    shareReplay(1)
  )

  store$.dispatch = action => subj$.next(action)

  return store$
}

export const store$ = createStore(reducer)

//actions
export const initiateRender = () =>store$.dispatch({type: 'INITIATE'})
export const addToQueue = buffer => store$.dispatch({type: 'INCREMENT', payload: buffer})
export const drawCompleted = () => store$.dispatch({type: 'DECREMENT'})