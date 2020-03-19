export default class DrawBoard {
    constructor(canvas){
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.draw = this.draw.bind(this)
        this.startDraw = this.startDraw.bind(this)
        this.endDraw = this.endDraw.bind(this)
        this.cursorWidth = 10
    }

    drawRect(x, y) {
        this.ctx.arc(x, y, this.cursorWidth, 0, Math.PI+(Math.PI*j)/2)
    }
    //Full clear
    clearBoard(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    }

    draw(event){
        let x = event.offsetX
        let y = event.offsetY
        this.drawRect(x,y, this.cursorWidth, this.cursorWidth)
    }

    drawOnClick(){
        this.canvas.addEventListener('mousedown', this.startDraw)
        this.canvas.addEventListener('mouseup', this.endDraw)
    }
    //Start&end drawing line
    startDraw(){
        this.canvas.addEventListener('mousemove', this.draw)
    }
    endDraw(){
        this.canvas.removeEventListener('mousemove', this.draw)
    }
    //Customize drawing pen
    set color (color) {
        this.ctx.fillStyle = color
    }
}