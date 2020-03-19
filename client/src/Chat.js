export default class Chat {
    constructor(userName){
        this.userName = userName
        this.status = 'Offline'
        this.ws = new WebSocket('ws://localhost:8080')
    }

    setStatus(value){
        this.status = value
        document.querySelector('.status').innerHTML = this.status
    }

    openConnection(){
        this.ws.onopen = () => this.setStatus('Online')
        this.ws.onclose = () => this.setStatus('Offline')
        this.ws.onmessage = res => console.log(res.data);
    }
}