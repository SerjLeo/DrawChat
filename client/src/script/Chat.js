import Alert from "./Alert"

export default class Chat {
    constructor(eventHandler){
        this.eventHandler = eventHandler
        this.ws = new WebSocket(`ws://${location.host}`)
        this.ws.onopen = () => new Alert('Connected to chat!', 'Success', 3000).showAlert()
        this.ws.onclose = () => {
            new Alert('Disconnected!', 'Success', 3000).showAlert()
            this.ws = null
        }
        this.ws.onmessage = msg => {
            let message = JSON.parse(msg.data)
            console.log(message);
            if (message.message.drawBuffer) {
                this.extractDrawBuffer(message)
            } else {
                this.printMessage(message)
            }
        }
    }

    sendMessage(msg) {
        if (typeof(msg) === "string")
          this.ws.send(JSON.stringify(msg))
    }
    printMessage(msg){
        let message = document.createElement('div')
        if(msg.from) {
            message.innerHTML = `<div class="chat-message">
                                    <div class="from">${msg.from} :</div>
                                    <div class="message">${msg.message}</div>
                                </div>`
        } else {
            message.innerHTML = `<div class="chat-message">
                                    <div class="from"></div>
                                    <div class="system-message">${msg.message}</div>
                                </div>`
        }
        document.querySelector('.chat').appendChild(message)
    }
    sendDrawBuffer(drawBuffer, options){
        this.ws.send(JSON.stringify({drawBuffer, options}))
    }
    extractDrawBuffer(data){
        console.log('extractDrawBuffer handled');
        this.eventHandler(data)
    }
    //         ws.onerror = function() {
    //           showMessage('WebSocket error');
    //         };
}