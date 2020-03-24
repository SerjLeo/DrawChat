export default class DrawBoard {
    constructor(canvas, bufferHandler, options){
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        this.mouseUpHandler = this.mouseUpHandler.bind(this)
        // this.drawRect = this.drawRect.bind(this)
        // this.startDraw = this.startDraw.bind(this)
        // this.endDraw = this.endDraw.bind(this)
        // this._cursorWidth = 5
        this.bufferHandler = bufferHandler || null;
        this.options = Object.assign({
                strokeStyle: '#f00',
                globalAlpha: 1,
                lineWidth: 10,
                lineCap: 'round',
                lineJoin: 'round',
                globalCompositeOperation: 'source-over',
                width: null,
                height: null,
                offsetX: 0,
                offsetY: 0
            },
            options
        );
        this.drawBuffer = [];
        this.canvasSnapShot = null;
        this.init()
    }

    init() {
        if (this.options.width && this.options.width != this.canvas.width) {
            this.canvas.width = this.options.width;
        }

        if (this.options.height && this.options.height != this.canvas.height) {
            this.canvas.height = this.options.height;
        }

        this.setCanvasOptions(this.options);

        if (typeof this.bufferHandler === 'function') {
            this.bindMouseHandlers();
        } else {
            this.bufferHandler = null;
        }
    }
    //set options
    setCanvasOptions(options) {
        options.strokeStyle? this.ctx.strokeStyle = options.strokeStyle:null
        options.globalAlpha? this.ctx.globalAlpha = options.globalAlpha:null
        options.lineWidth? this.ctx.lineWidth = options.lineWidth:null
        options.lineCap? this.ctx.lineCap = options.lineCap: null
        options.lineJoin? this.ctx.lineJoin = options.lineJoin: null
        options.globalCompositeOperation? this.ctx.globalCompositeOperation = options.globalCompositeOperation: null
    };
    //Core draw functionality
    getCursorPosition(mouseEvent) {
        const styling = getComputedStyle(this.canvas, null);
    
        const topBorder = parseInt(styling.getPropertyValue('border-top-width'), 10);
        const rightBorder = parseInt(styling.getPropertyValue('border-right-width'), 10);
        const bottomBorder = parseInt(styling.getPropertyValue('border-bottom-width'), 10);
        const leftBorder = parseInt(styling.getPropertyValue('border-left-width'), 10);
    
        const rect = this.canvas.getBoundingClientRect();
    
        const canvasX = (mouseEvent.clientX - rect.left - leftBorder) * (this.canvas.width / (rect.width - rightBorder - leftBorder));
        const canvasY = (mouseEvent.clientY - rect.top - topBorder) * (this.canvas.height / (rect.height - topBorder - bottomBorder));
        
        return [canvasX, canvasY];
    };
    render(buffer, offsetX, offsetY) {
        if (buffer.length === 0) {
            return;
        }
        if (!offsetX) offsetX = 0;
        if (!offsetY) offsetY = 0;
        this.ctx.beginPath();
        this.ctx.moveTo(buffer[0][0]+offsetX, buffer[0][1]+offsetY);
        this.ctx.stroke();

        // for(let i = 1; i<buffer.length; i++) {
        //     this.ctx.lineTo(buffer[i][0]+offsetX, buffer[i][1]+offsetY);
        //     this.ctx.stroke();
        // }
        // this.ctx.closePath();

        let i = 1
        let interval = setInterval(() => {
            if(buffer[i]){
                this.ctx.lineTo(buffer[i][0]+offsetX, buffer[i][1]+offsetY);
                this.ctx.stroke();
                i++
            } else {
                clearInterval(interval)
                this.ctx.closePath();
                store$.dispatch({type: 'DECREMENT'})
            }
        }, 10)
    };
    draw(buffer, drawOptions) {
        
        const options = Object.assign({}, this.options, drawOptions);
    
        const offX = options.offsetX ? parseInt(options.offsetX, 10) : 0;
        const offY = options.offsetY ? parseInt(options.offsetY, 10) : 0;
    
        this.setCanvasOptions(options);

        
        this.render(buffer, offX, offY);
    
        // if (this.canvasSnapShot) {
        //     this.stashCanvas();
        //     this.setCanvasOptions(this.options);
        //     this.render(this.drawBuffer);
        // }
    };

    //Define and bind event handlers
    mouseDownHandler(e){
        e.preventDefault();
        this.drawBuffer.length = 0;
        const pos = this.getCursorPosition(e);
        this.drawBuffer.push(pos);
        this.setCanvasOptions(this.options);
        this.ctx.beginPath();
        this.ctx.lineTo(pos[0], pos[1]);
        this.ctx.stroke();
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler)
    }
    mouseUpHandler(e){
        e.preventDefault();
        if (this.drawBuffer.length === 0) {
            return null;
        }
        this.ctx.closePath()
        store$.dispatch({type: 'INCREMENT', payload: this.drawBuffer})
        if (this.bufferHandler) {
            this.bufferHandler(this.drawBuffer.slice(), {
                strokeStyle: this.options.strokeStyle,
                globalAlpha: this.options.globalAlpha,
                lineWidth: this.options.lineWidth,
                lineCap: this.options.lineCap,
                lineJoin: this.options.lineJoin,
                globalCompositeOperation: this.options.globalCompositeOperation,
                timeout: this.options.timeout,
                width: this.width,
                height: this.height
            });
        }
        this.drawBuffer.length = 0;    
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler)
    }
    mouseMoveHandler(e){
        e.preventDefault();
        const pos = this.getCursorPosition(e);
        this.drawBuffer.push(pos);
        this.ctx.lineTo(pos[0], pos[1]);
        this.ctx.stroke();
    }
    bindMouseHandlers() {
        this.canvas.addEventListener('mousedown', this.mouseDownHandler)
        this.canvas.addEventListener('mouseup', this.mouseUpHandler)
        this.canvas.addEventListener('mouseout', this.mouseUpHandler)
    };
    //Full clear
    clearBoard() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    }

    //Snapshot
    stashCanvas() {
        this.canvasSnapShot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    restoreCanvas() {
        if (!this.canvasSnapShot) {
            return null;
        }
        this.ctx.putImageData(this.canvasSnapShot, 0, 0);
    };
    saveImage(){
        var dataURL = this.canvas.toDataURL('image/png');
        document.querySelector('.download').href = dataURL;
        document.querySelector('.download').download = 'canvas.png';
        
    }
}